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

export const route = (app: Application, prefix = '/v1') => {
  app.use(prefix, router)
}
