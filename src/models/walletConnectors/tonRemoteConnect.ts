import { TonhubConnector, TonhubCreatedSession, TonhubWalletConfig } from 'ton-x'
import { tonConnectLogger } from '../../logging'
import { emitAuth, emitAuthVerified } from '../../routes/websockets'

interface ConnectorData {
  connector: TonhubConnector,
  tonSession: TonhubCreatedSession,
  ready: boolean,
  wallet?: TonhubWalletConfig,
}

const connectorInstances = new Map<string, ConnectorData>()

const SESSION_WAITING_TIMEOUT = 5e3
const SIGN_SIGNATURE_TIMEOUT = 5e6

const getConnectorData = async (sessionId: string): Promise<ConnectorData> => {
  const existingConnector = connectorInstances.get(sessionId)
  if (!existingConnector) {
    const connector = new TonhubConnector({ network: 'mainnet' })
    const tonSession = await connector.createNewSession({
      name: 'epine',
      url: 'epine.com',
    })
    const conn = {
      connector,
      tonSession,
      ready: false,
    }
    connectorInstances.set(sessionId, conn)

    return conn
  }

  return existingConnector
}

const setConnectorInstance = (sessionId: string, data: ConnectorData) => {
  connectorInstances.set(sessionId, data)
}

class TonWalletConnector {
  async getURI(sessionId: string): Promise<string> {
    const tonConnector = await getConnectorData(sessionId)

    tonConnector.connector.awaitSessionReady(tonConnector.tonSession.id, SESSION_WAITING_TIMEOUT)
      .then(async awaitedSession => {
        if (awaitedSession.state !== 'ready') {
          throw new Error(`Incorrect state of awaited session: ${awaitedSession.state}`)
        }

        setConnectorInstance(sessionId, {
          ...await getConnectorData(sessionId),
          wallet: awaitedSession.wallet,
        })

        emitAuth(sessionId, [awaitedSession.wallet.address])
      })
      .catch(err => tonConnectLogger.error(err))

    return tonConnector.tonSession.link
  }

  async authVerify(sessionId: string) {
    const connectorData = await getConnectorData(sessionId)
    if (!connectorData.wallet) {
      throw new Error('Wallet session was not initialized')
    }
    tonConnectLogger.debug(`Verifying wallet for ${sessionId}, address: ${connectorData.wallet?.address}`)

    const signResponse = await connectorData.connector.requestSign({
      seed: connectorData.tonSession.seed,
      appPublicKey: connectorData.wallet.appPublicKey,
      timeout: SIGN_SIGNATURE_TIMEOUT,
      text: 'Hi! Sign it 😉',
    })
    if (signResponse.type !== 'success') {
      throw new Error(`Signing failed, signResponse: ${JSON.stringify(signResponse)}`)
    }
    emitAuthVerified(sessionId, connectorData.wallet.address)
  }
}

export const tonWalletConnector = new TonWalletConnector()
