const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

//const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

//const router = require('./router')

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

//app.use(router);

io.on("connection", (socket) => {
  console.log("New socket connected");

  /*
  socket.on('join', ({name, room}, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });
  */

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
