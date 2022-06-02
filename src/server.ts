import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { bindLogger } from './logging'
import { bindRoutes } from './routes'
import { addHandlers } from './routes/websockets'
import { VERSIONS } from './routes/websockets/constants'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './routes/websockets/types'

const app = express()

bindLogger(app)
bindRoutes(app)

export const server = createServer(app)

export const io = (new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server)).of(VERSIONS.V1)

addHandlers(io)
