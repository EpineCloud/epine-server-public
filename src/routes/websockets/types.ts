import { CHANNELS } from './constants'

export interface ServerToClientEvents {
  [CHANNELS.AUTH_CONNECTED]: () => void
  [CHANNELS.SESSION]: (sessionId: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClientToServerEvents {
  [CHANNELS.SUBSCRIBE]: (sessionId?: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {
}

export interface SocketData {
  sessionId: string
}
