import { Application } from 'express'
import pino from 'pino'
import logger from 'pino-http'

export const bindLogger = (app: Application) => {
  app.use(logger({ logger: pino() as any }))
}
