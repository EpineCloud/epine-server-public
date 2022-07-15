import { Namespace, Socket } from 'socket.io'
import { CHANNELS as EVENTS } from './constants'
import { io } from '../../server'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './types'
import crypto from 'crypto'

const sessionSocketMap: {[sessionId: string]: Socket['id']} = {}

export const addHandlers = (io: Namespace<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
  io.on('connect', (socket) => {
    console.debug(`Socket: ${socket.id}, connected`)

    socket.on(EVENTS.SUBSCRIBE, ({ sessionId } = {}) => {
      if (sessionId && sessionSocketMap[sessionId]) {
        sessionSocketMap[sessionId] = socket.id
        console.debug(`SessionId: ${sessionId} provided, socketId: ${socket.id}`)
        return
      }

      const newSessionId = crypto.randomUUID()
      socket.data.sessionId = newSessionId
      sessionSocketMap[newSessionId] = socket.id

      console.debug(`Socket: ${socket.id}, subscribed with sessionId: ${newSessionId}`)

      socket.emit(EVENTS.SESSION, { sessionId: newSessionId })
    })
  })
}

export const emitAuth = (sessionId: string, publicKeys: string[]) => {
  const socketId = sessionSocketMap[sessionId]
  console.debug(`Emitting auth for socketId: ${socketId}, sessionId: ${sessionId}`)
  io.to(socketId).emit(EVENTS.AUTH_CONNECTED, { publicKeys })
}

export const emitAuthVerified = (sessionId: string, publicKey: string) => {
  const socketId = sessionSocketMap[sessionId]
  console.debug(`Emitting auth verified for socketId: ${socketId}, sessionId: ${sessionId}`)
  io.to(socketId).emit(EVENTS.AUTH_VERIFIED, { publicKey })
}
