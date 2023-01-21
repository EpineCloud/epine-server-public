import { server } from './server'

const PORT = process.env.PORT ? +process.env.PORT : 3000

server.listen(PORT, '0.0.0.0', () => {
  console.log('Listening')
})
