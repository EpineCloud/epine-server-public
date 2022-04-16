import { server } from "./server"

server.listen(3000, '0.0.0.0', () => {
  console.log('Listening')
})

// Client subscribes on websocket server -> receives sessionId
// Client requests URI with sessionsId -> Server return URI with sessionId in it
// Wallet makes request on server with sessionId -> Server emits action on sessionId
