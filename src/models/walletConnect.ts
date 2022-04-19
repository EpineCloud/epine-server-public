import NodeWalletConnect from '@walletconnect/node'
import { emitAuth } from '../routes/websockets'

class WalletConnect {
  async getURI(sessionId: string): Promise<string> {
    const walletConnector = new NodeWalletConnect(
      {
        bridge: 'https://bridge.walletconnect.org',
      },
      {
        clientMeta: {
          description: 'epine',
          url: 'https://nodejs.org/en/',
          icons: ['https://cdn.pixabay.com/photo/2012/04/13/11/15/forest-31910_1280.png'],
          name: 'epine',
        },
      }
    )

    if (!walletConnector.connected) {
      await walletConnector.createSession({ chainId: 1 })
    }

    walletConnector.on('connect', () => {
      emitAuth(sessionId)
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
      walletConnector.killSession().catch(error => console.error({ error }, 'Wallet connect error during session kill'))
    })

    console.debug({ uri: walletConnector.uri }, 'URI for connecting wallet')

    return walletConnector.uri
  }
}

export const walletConnect = new WalletConnect()
