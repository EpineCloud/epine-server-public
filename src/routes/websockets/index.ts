import { Namespace, Socket } from 'socket.io'
import { CHANNELS } from './constants'
import { io } from '../../server'

export const addHandlers = (io: Namespace) => {
  io.on('connect', (socket) => {
    console.debug(`Socket id connected: ${socket.id}`)
    socket.on('subscribe', () => {
      socket.data.sessionId = crypto.randomUUID()
    })
  })
}

export const emitAuth = (socketId: Socket['id']) => {
  console.debug('Emitting auth')
  io.to(socketId).emit(CHANNELS.AUTH_CONNECTED)
}
