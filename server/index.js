const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

//const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

//const router = require('./router')

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://3000-btwalpole-reactnodebuzz-sm1gmvmjrdp.ws-eu47.gitpod.io",
      "http://localhost:3000",
    ],
  },
});

//app.use(router);
app.use(cors());

httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const state = {}; //store the state of the buzzer of each room, and the users in it???? - maybe we can just get this with a function
const sessions = {}; //allows us to look up room name of a given sessionID

io.on("connection", (socket) => {
  console.log("New socket connected");
  let sessionID = socket.handshake.auth.sessionID;

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
    console.log("sessionID found in localStorage: ", sessionID);
    // check if we have a reference of this sessionID
    console.log("sessions[sessionID]: ", sessions[sessionID]);
    console.log("sessions: ", sessions);
    if (sessions[sessionID]) {
      socket.emit("oldSession", {
        userID: sessions[sessionID].userID,
        roomName: sessions[sessionID].room,
        oldUserName: sessions[sessionID].username,
      });
    } else {
      console.log(
        "found sessionID in localStorage " +
          sessionID +
          " but no session in server! Telling client to remove session from storage and disconnect"
      );
      socket.emit("clearLocalStorage");
    }
  } else {
    console.log("no sessionID found in localStorage");
    const username = socket.handshake.auth.username;
    if (!username) {
      console.log("invalid or no username!!");
    }
    //set the userID and username on the session
    sessionID = makeId(10);
    sessions[sessionID] = {
      userID: makeId(15),
      username,
    };

    socket.emit("newSession", {
      sessionID,
      userID: sessions[sessionID].userID,
    });
  }

  socket.on("newGame", function () {
    console.log("starting new game");
    const roomName = makeId(5);
    //set room on the session
    sessions[sessionID].room = roomName;

    //define state of room, set admin as first user
    state[roomName] = {
      admin: sessions[sessionID].username,
      users: [sessions[sessionID].username],
      buzzerEnabled: true,
    };

    socket.join(roomName);
    socket.emit("enterGameScreen", {
      roomToJoin: roomName,
      username: sessions[sessionID].username,
      roomAdmin: state[roomName].admin,
    });
    console.log("new game created. Users: ", state[roomName].users);
  });

  socket.on("joinGame", function ({ roomToJoin }) {
    console.log("sessionID " + sessionID + " now joining " + roomToJoin);
    console.log("state on joining: ", state);
    if (state[roomToJoin]) {
      console.log("state.roomToJoin: ", state[roomToJoin]);
      //first need to check if a player already exists with this name in this room
      if (state[roomToJoin].users.includes(sessions[sessionID].username)) {
        socket.emit("userNameTaken", sessions[sessionID].username);
        console.log("username taken");
      } else {
        console.log("username not taken");
        //if name not taken, join the room:
        sessions[sessionID].room = roomToJoin;
        console.log(
          "adding " + sessions[sessionID].username + " to room " + roomToJoin
        );
        console.log("before addition users are: " + state[roomToJoin].users);
        state[roomToJoin].users.push(sessions[sessionID].username);
        console.log("after addition users are: " + state[roomToJoin].users);
        socket.join(roomToJoin);
        socket.emit("enterGameScreen", {
          roomToJoin,
          username: sessions[sessionID].username,
          roomAdmin: state[roomToJoin].admin,
        });
        console.log(
          "sending updatePlayerList event to all in room: ",
          roomToJoin
        );
      }
    } else {
      socket.emit("noSuchRoom", roomToJoin);
    }
  });

  socket.on("getBuzzerState", () => {
    io.to(sessions[sessionID].room).emit("buzzerState", {
      buzzerEnabled: state[sessions[sessionID].room].buzzerEnabled,
    });
  });

  socket.on("getPlayerList", () => {
    let currentRoom = sessions[sessionID].room;
    console.log("getting playerList: ", state[currentRoom].users);
    io.in(currentRoom).emit("updatePlayerList", {
      users: state[currentRoom].users,
    });
  });

  socket.on("buzz", function (data) {
    state[data.roomBuzzed].buzzerEnabled = false;
    io.to(data.roomBuzzed).emit("buzzed", data);
  });

  socket.on("reset", function ({ roomReset }) {
    state[roomReset].buzzerEnabled = true;
    io.to(roomReset).emit("reset");
  });

  /*
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });
  */

  socket.on("disconnect", () => {
    console.log("sessionID " + sessionID + " disconnected");
    //check if user is in a room
    if (sessionID) {
      if (sessions[sessionID]) {
        console.log("disconnecting sessions[sessionID]: ", sessions[sessionID]);
        if (sessions[sessionID].hasOwnProperty("room")) {
          const roomToLeave = sessions[sessionID].room;
          //remove user from room state
          console.log(
            "removing " +
              sessions[sessionID].username +
              "from room: " +
              roomToLeave
          );
          const i = state[roomToLeave].users.indexOf(
            sessions[sessionID].username
          );
          state[roomToLeave].users.splice(i, 1);
          console.log(
            "users remaining after removal: ",
            state[roomToLeave].users
          );

          io.in(roomToLeave).emit("updatePlayerList", {
            users: state[roomToLeave].users,
          });

          // TODO:
          // if room is empty - delete it from the state object
        } else {
          console.log("no room found to remove the user from");
        }
      }
    }
  });
});

function makeId(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
