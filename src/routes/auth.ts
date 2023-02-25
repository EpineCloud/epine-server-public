import express, { Application } from 'express'

import { walletConnect } from '../models/walletConnectors/walletConnect'
import { tonWalletConnector } from '../models/walletConnectors/tonRemoteConnect'

import { ChainType } from './types'

const router = express.Router({ mergeParams: true })

router.get('/auth/request', async (req, res, next) => {
  const { 'x-session-id': sessionId } = req.headers
  if (!sessionId || typeof sessionId !== 'string') {
    return res.sendStatus(400)
  }

  const { chainType } = req.query

  const uri = chainType === ChainType.TVM
    ? await tonWalletConnector.getURI(sessionId)
    : await walletConnect.getURI(sessionId)

  res.status(200).send({ uri })
})

router.get('/auth/verify', async (req, res, next) => {
  const { 'x-session-id': sessionId } = req.headers
  if (!sessionId || typeof sessionId !== 'string') {
    return res.sendStatus(400)
  }
  const { chainType } = req.query

  if (chainType === ChainType.TVM) {
    req.log.error('Not implemented yet')
    return res.sendStatus(501)
  }

  req.log.info(`Started verification process for session: ${sessionId}`)
  walletConnect.authVerify(sessionId)
    .then(() => { req.log.info(`Successfully finished verification process for session: ${sessionId}`) })
    .catch(error => { req.log.error(error, 'Auth verify request failed') })

  res.sendStatus(202)
})

export const bindRoutes = (app: Application, prefix: string) => {
  app.use(prefix, router)
}
