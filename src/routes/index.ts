import { Application } from 'express'
import { bindRoutes as bindAuthRoutes } from './auth'

export const bindRoutes = (app: Application, prefix = '/v1') => {
    bindAuthRoutes(app, prefix)
}
