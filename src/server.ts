import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { route as authRouter } from './routes/auth'
import { addHandlers } from './routes/websockets'
import { VERSIONS } from './routes/websockets/constants'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './routes/websockets/types'

const app = express()

authRouter(app)

export const server = createServer(app)

export const io = (new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server)).of(VERSIONS.V1)

addHandlers(io)
