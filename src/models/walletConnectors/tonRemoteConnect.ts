import TonConnect, { Wallet, toUserFriendlyAddress, WalletConnectionSourceHTTP } from '@tonconnect/sdk'
import { tonConnectLogger } from '../../logging'
import { emitAuth } from '../../routes/websockets'

interface IStorage {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
}
const localStorage: Record<string, string> = {}
const getLocalStorage = (sessionId: string): IStorage => ({
  setItem: async (key: string, value: string) => { localStorage[`${sessionId}:${key}`] = value },
  getItem: async (key: string) => localStorage[`${sessionId}:${key}`] || null,
  removeItem: async (key: string) => { delete localStorage[`${sessionId}:${key}`] },
})

interface ConnectorData {
  connector: TonConnect,
  wallet?: Wallet,
}
const connectorInstances = new Map<string, ConnectorData>()

const getConnectorData = (sessionId: string): ConnectorData => {
  const existingConnector = connectorInstances.get(sessionId)
  if (!existingConnector) {
    const connector = new TonConnect({
      // TODO
      manifestUrl: 'https://storage.googleapis.com/epine-trash/tonconnect-manifest.json',
      storage: getLocalStorage(sessionId),
    })

    const conn = {
      connector,
    }
    connectorInstances.set(sessionId, conn)

    return conn
  }

  return existingConnector
}

const setConnectorInstance = (sessionId: string, data: ConnectorData) => {
  connectorInstances.set(sessionId, data)
}

const WALLET_CONNECTION_SOURCE: WalletConnectionSourceHTTP = {
  universalLink: 'https://app.tonkeeper.com/ton-connect',
  bridgeUrl: 'https://bridge.tonapi.io/bridge',
}

class TonWalletConnector {
  async getURI(sessionId: string): Promise<string> {
    const connectorData = getConnectorData(sessionId)
    await connectorData.connector.restoreConnection()

    connectorData.connector.onStatusChange(wallet => {
      if (!wallet) {
        tonConnectLogger.error('No wallet')
        return
      }

      // Set wallet
      setConnectorInstance(sessionId, {
        ...getConnectorData(sessionId),
        wallet,
      })

      const address = toUserFriendlyAddress(wallet.account.address)
      emitAuth(sessionId, [address])
    })

    // TODO: Do we need to use something else for other wallets?
    return connectorData.connector.connect(WALLET_CONNECTION_SOURCE)
  }
}

export const tonWalletConnector = new TonWalletConnector()
