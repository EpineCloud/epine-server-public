import express, { Application } from 'express'

const router = express.Router({ mergeParams: true })

router.post('/auth/request', (req, res, next) => {
  
})

export const route = (app: Application, prefix = '/v1') => {
  app.use(prefix, router)
}
