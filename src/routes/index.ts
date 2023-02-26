import { Application } from 'express'
import { bindRoutes as bindAuthRoutes } from './auth'
import { bindRoutes as bindTokensRoutes } from './tokens'

export const bindRoutes = (app: Application, prefix = '/v1') => {
    bindAuthRoutes(app, prefix)
    bindTokensRoutes(app, prefix)
}
