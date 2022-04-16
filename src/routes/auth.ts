import express, { Application } from 'express'

const router = express.Router({ mergeParams: true })

export const route = (app: Application) => {
  app.use(router)
}
