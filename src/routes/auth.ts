import express, { Application } from 'express'
import { walletConnect } from '../models/walletConnect'

const router = express.Router({ mergeParams: true })

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/auth/request', async (req, res, next) => {
  const { 'x-session-id': sessionId } = req.headers
  if (!sessionId || typeof sessionId !== 'string') {
    return res.sendStatus(400)
  }
  const uri = await walletConnect.getURI(sessionId)

  res.status(200).send({ uri })
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/auth/verify', async (req, res, next) => {
  const { 'x-session-id': sessionId } = req.headers
  if (!sessionId || typeof sessionId !== 'string') {
    return res.sendStatus(400)
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
