import WalletConnect from '@walletconnect/client'
import { emitAuth } from '../routes/websockets'

const walletConnectInstances = new Map<string, WalletConnect>()

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
        console.error({ error, sessionId }, 'Wallet connect connect error')
      }

      console.debug({ payload: JSON.stringify(payload) }, 'Wallet connect connect event')
      if (payload.params[0].accounts.length > 1) {
        console.warn(payload.params[0].accounts.join(' '), 'More than one public key returned on wallet connect event')
      }
      emitAuth(sessionId, payload.params.accounts)
    })

    walletConnector.on('session_update', (error, payload) => {
      if (error) {
        console.error({ error, sessionId }, 'Wallet connect session update error')
        return
      }

      console.info({ payload, sessionId }, 'Wallet connect session update')
    })

    walletConnector.on('disconnect', (error, payload) => {
      if (error) {
        console.info({ error }, 'Wallet connect disconnect error')
        return
      }

      console.info({ payload, sessionId }, 'Wallet connect disconnect')
      walletConnectInstances.delete(sessionId)
      walletConnector.killSession().catch(error => console.error({ error }, 'Wallet connect error during session kill'))
    })

    console.debug({ uri: walletConnector.uri }, 'URI for connecting wallet')

    return walletConnector.uri
  }
}

export const walletConnect = new WalletConnectService()
