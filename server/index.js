const express = require("express")
const cors = require("cors")
const { createServer } = require("http")
const { Server } = require("socket.io")

const app = express() // Creates HTTP server
app.use(express.json()) // utility to process JSON in requests
app.use(cors()) // utility to allow clients to make requests from other hosts or ips

const httpServer = createServer(app) // Explicity creates an HTTP server from the Express app

const io = new Server(httpServer, {
  path: "/real-time",
  cors: {
    origin: "*", // Allow requests from any origin
  },
}) // Creates a WebSocket server, using the same HTTP server as the Express app and listening on the /real-time path

io.on("connection", (socket) => {
  console.log("a user connected") // This will be printed every time a client connects to the
  socket.on("isEdwar", (message) => {
    console.log("Is Edwar")
  })
})

httpServer.listen(5050, () => {
  // Starts the server on port 5050, same as before but now we are using the httpServer object
  console.log(`Server is running on http://localhost:${5050}`)
})
