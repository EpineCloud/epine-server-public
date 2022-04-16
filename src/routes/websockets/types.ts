import { CHANNELS } from './constants'

export interface ServerToClientEvents {
  [CHANNELS.AUTH_CONNECTED]: () => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClientToServerEvents {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {
}

export interface SocketData {
  sessionId: string
}
