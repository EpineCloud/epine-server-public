import WalletConnect from '@walletconnect/client'
import { walletConnectLogger } from '../../logging'
import { emitAuth, emitAuthVerified } from '../../routes/websockets'

const walletConnectInstances = new Map<string, WalletConnect>()

const getAuthTypeData = ({
  username,
  userAccount,
  projectName,
  chainId,
}: { username: string, userAccount: string, projectName: string, chainId: number }) => {
  return JSON.stringify({
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
      ],
      Person: [
        { name: 'name', type: 'string' },
        { name: 'account', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    },
    primaryType: 'Mail',
    domain: {
      name: projectName,
      version: '1.0',
      chainId,
    },
    message: {
      from: {
        name: username,
        account: userAccount,
      },
      to: {
        name: username,
        account: userAccount,
      },
      contents: `Authorizing ${projectName} user`,
    },
  })
}

const getWalletConnectInstance = (sessionId: string) => {
  const existingWCI = walletConnectInstances.get(sessionId)
  if (!existingWCI) {
    const wci = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      clientMeta: {
        description: 'epine',
        url: 'https://walletconnect.org',
        icons: ['https://cdn.pixabay.com/photo/2012/04/13/11/15/forest-31910_1280.png'],
        name: 'epine',
      },
    })
    walletConnectInstances.set(sessionId, wci)

    return wci
  }

  return existingWCI
}

class WalletConnectService {
  async getURI(sessionId: string): Promise<string> {
    const walletConnector = getWalletConnectInstance(sessionId)

    if (!walletConnector.connected) {
      await walletConnector.createSession({ chainId: 1 })
    }

    walletConnector.on('connect', (error, payload) => {
      if (error) {
        walletConnectLogger.error({ error, sessionId }, 'Wallet connect connect error')
      }

      walletConnectLogger.debug({ payload: JSON.stringify(payload) }, 'Wallet connect connect event')
      if (payload.params[0].accounts.length > 1) {
        walletConnectLogger.warn(payload.params[0].accounts.join(' '), 'More than one public key returned on wallet connect event')
      }
      emitAuth(sessionId, payload.params.accounts)
    })

    walletConnector.on('session_update', (error, payload) => {
      if (error) {
        walletConnectLogger.error({ error, sessionId }, 'Wallet connect session update error')
        return
      }

      walletConnectLogger.info({ payload, sessionId }, 'Wallet connect session update')
    })

    walletConnector.on('disconnect', (error, payload) => {
      if (error) {
        walletConnectLogger.info({ error }, 'Wallet connect disconnect error')
        return
      }

      walletConnectLogger.info({ payload, sessionId }, 'Wallet connect disconnect')
      walletConnectInstances.delete(sessionId)
      walletConnector.killSession().catch(error => walletConnectLogger.error({ error }, 'Wallet connect error during session kill'))
    })

    walletConnectLogger.debug({ uri: walletConnector.uri }, 'URI for connecting wallet')

    return walletConnector.uri
  }

  async authVerify(sessionId: string) {
    try {
      const walletConnect = await getWalletConnectInstance(sessionId)
      walletConnectLogger.debug(`Verifying wallet for ${sessionId}, address: ${walletConnect.accounts[0]}`)
      const response = await walletConnect.signTypedData([
        walletConnect.accounts[0],
        getAuthTypeData({
          username: 'Test',
          userAccount: walletConnect.accounts[0],
          projectName: 'Test',
          chainId: 1,
        }),
      ])
      walletConnectLogger.debug({ response, sessionId })

      emitAuthVerified(sessionId, walletConnect.accounts[0])
    } catch (error) {
      walletConnectLogger.error(error, 'Failed to authorize')
      throw error
    }
  }
}

export const walletConnect = new WalletConnectService()
