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

const state = {}; //store the state of the buzzer of each room, and the users in it???? - maybe we can just get this with a function
const sessions = {}; //allows us to look up room name of a given sessionID

io.on("connection", (socket) => {
  console.log("New socket connected");
  const sessionID = socket.handshake.auth.sessionID;

  //on connection we will have either: 
    // A) a sessionID present in localStorage already, so user is auto added to room before entering a name
    // B) no sessionID found, so we've only connected once the user has entered their username
    // C) a sessionID present in localStorage for which we have no reference server side

  // We pass the username entered in the front end via the socket.auth object, accessible server-side via socket.handshake.auth
    // In case A, socket.auth.username is not yet set on the client-side so we need to send that to the client to be set for subsequent requests
    // In case B, socket.auth.username is already set client-side so we just provide the new session ID
    // In case C, socket.auth.username is not yet set on the client-side but so we tell client side to clear localStorage and await username to be set

  //on connection, check if there's a sessionID
    //if present, check if the sessionID has an associated user etc
      //if so, we set the session details on the socket. user joins its associated room
      //if not, tell front end to clear localStorage and assign a new sessionID
    //if not present, assign one to the user

  if (sessionID) {
    console.log('sessionID found in localStorage: ', sessionId)
    // check if we have a reference of this sessionID
    if (sessions[sessionID]) {

      // setting values on the socket instance
      socket.sessionID = sessionID;
      socket.userID = sessions[sessionID].userID;
      socket.username = sessions[sessionID].username;
      console.log("found session details: ", sessions[sessionID]);

      socket.emit("oldSession", {
        userID: socket.userID,
        roomName: sessions[sessionID].room,
        oldUserName: socket.username,
      });
    } else {
      console.log(
        "found sessionID in localStorage " +
          sessionID +
          " but no session in server!"
      );
      console.log(
        "telling client to remove session from storage and disconnect"
      );
      socket.emit("clearLocalStorage");
    }
  } else {
    console.log('no sessionID found in localStorage')
  }

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
