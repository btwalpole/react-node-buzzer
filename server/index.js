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

  //on connection we will have either: 
    // A) a sessionID present in localStorage already, so user is auto added to room before entering a name
    // B) no sessionID found, so we've only connected once the user has entered their username
    // C) a sessionID present in localStorage for which we have no reference server side

    // We pass the username entered in the front end 
    //In case B, socket.auth.username is already set client-side, but in A and we need to ensure this is set after the user enters their name

  //on connection, check if there's a sessionID
    //if present, check if the sessionID has an associated user 
      //if so, user joins its associated room
      //if not, tell front end to clear localStorage and assign a new sessionID
    //if not present, assign one to the user

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
