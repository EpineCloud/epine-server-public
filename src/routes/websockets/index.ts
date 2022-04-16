import { Namespace, Socket } from 'socket.io'
import { CHANNELS } from './constants'
import { io } from '../../server'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './types'

export const addHandlers = (io: Namespace<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
  io.on('connect', (socket) => {
    socket.data.sessionId = crypto.randomUUID()
    console.debug(`Socket id connected: id: ${socket.id}, sessionId: ${socket.data.sessionId}`)
  })
}

export const emitAuth = (socketId: Socket['id']) => {
  console.debug('Emitting auth')
  io.to(socketId).emit(CHANNELS.AUTH_CONNECTED)
}
