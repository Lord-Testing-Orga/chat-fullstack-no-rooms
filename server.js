const express = require("express")
const app = express() // create API
const socketIo = require("socket.io")

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log("API server started up", PORT))

// wrap server with a socket server
const io = socketIo(server, {
  cors: { // configure CORS
    origin: "*" 
  }  
})

// listen to incoming socket io messages
io.on("connection", (socket) => {

  console.log("Someone connected...", socket.id)

  // send message right back
  // io.to(socket.id).emit('message', { msg: "Welcome to our message services, my friend" })

  // listen for incoming messages (= message hotline)
  socket.on("message", (data) => {
    const { text, user } = data // expect fields "msg" and "user"
    console.log(data)
    socket.broadcast.emit('message', data) // send to ALL other parties, except sender!
  })

  // socket.on('disconnect', () => {
  //   console.log('Client disconnected');
  //   // onDisconnect();
  // });
  
})