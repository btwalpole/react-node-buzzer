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
      "https://brilliant-pika-0b19a2.netlify.app",
    ],
  },
});

//app.use(router);
app.use(cors());

httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const state = {};
/**
 *  type state = {
 *    roomName: {
        admin: string;
        users: string[];
        buzzerEnabled: boolean;
      }
    }
 */

const sessions = {};
/*
 * type sessions = {
 *    sessionID: {
 *      userID: string;
        username: string;
 *    } 
 * }
 * */
//allows us to look up room name of a given sessionID

io.on("connection", (socket) => {
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
    console.log("sessions after newGame", sessions);
    console.log("state after newGame", state);
  });

  socket.on("joinGame", function ({ roomToJoin }) {
    console.log("sessionID " + sessionID + " now joining " + roomToJoin);
    console.log("state on joining: ", state);
    if (state[roomToJoin]) {
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
        state[roomToJoin].users.push(sessions[sessionID].username);
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
    console.log("sessions after joinGame", sessions);
    console.log("state after joinGame", state);
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

  socket.on("exitRoom", function ({ room }) {
    sessions[sessionID].room = undefined;
    console.log("sessions after exit", sessions);
    io.in(room).emit("updatePlayerList", {
      users: state[room].users,
    });
  });

  socket.on("disconnect", () => {
    console.log("sessionID " + sessionID + " disconnected");
    //check if user is in a room
    if (sessionID) {
      if (sessions[sessionID]) {
        if (sessions[sessionID].hasOwnProperty("room")) {
          const roomToLeave = sessions[sessionID].room;
          console.log("roomToLeave", roomToLeave);
          console.log("state[roomToLeave]", state[roomToLeave]);
          if (roomToLeave && state[roomToLeave]) {
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

            io.in(roomToLeave).emit("updatePlayerList", {
              users: state[roomToLeave].users,
            });

            if (
              state[roomToLeave].users.length > 0 &&
              state[roomToLeave].admin === sessions[sessionID].username
            ) {
              state[roomToLeave].admin = state[roomToLeave].users[0];
              io.in(roomToLeave).emit("updateAdmin", {
                roomToUpdate: roomToLeave,
                newAdmin: state[roomToLeave].users[0],
              });
            }
            if (state[roomToLeave].users.length === 0) {
              delete state[roomToLeave];
              // socket.emit("roomDeleted", roomToLeave);
            }
          }
        } else {
          console.log("no room found to remove the user from");
        }
        console.log("sessions after disconnect", sessions);
        console.log("state after disconnect", state);
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
