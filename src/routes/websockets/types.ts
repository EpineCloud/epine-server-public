import { CHANNELS } from './constants'

export type ServerToClientEvents = {
  [CHANNELS.AUTH_CONNECTED]: () => void
}

export interface ClientToServerEvents {
}

export interface InterServerEvents {
}

export interface SocketData {
  sessionId: string
}
