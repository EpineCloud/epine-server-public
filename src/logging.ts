import { Application } from 'express'
import pino from 'pino'
import pinoHttp from 'pino-http'

export const logger = pino({ level: 'debug' })

export const walletConnectLogger = logger.child({ service: 'wallet-connector' })
export const tonConnectLogger = logger.child({ service: 'ton-connector' })

export const bindLogger = (app: Application) => {
  app.use(pinoHttp({ logger: logger as any }))
}
