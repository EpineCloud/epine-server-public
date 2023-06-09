import { CHANNELS } from './constants'

export interface ServerToClientEvents {
  [CHANNELS.AUTH_CONNECTED]: (payload: { addresses: string[] }) => void
  [CHANNELS.AUTH_VERIFIED]: (payload: { address: string }) => void
  [CHANNELS.SESSION]: (payload: { sessionId: string }) => void
}

export interface ClientToServerEvents {
  [CHANNELS.SUBSCRIBE]: (payload: { sessionId?: string }) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {
}

export interface SocketData {
  sessionId: string
}
