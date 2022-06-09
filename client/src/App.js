import React, { useState, useEffect} from "react";
import socket from "./socket";
import EnterName from "./components/EnterName/EnterName";
import Home from "./components/Home/Home"
import Buzzer from "./components/Buzzer/Buzzer";
import "./App.css";

function App() {
  const [joinedGame, setJoinedGame] = useState(false);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [admin, setAdmin] = useState(false);

  function handleNameChange(newName) {
    setName(newName)
  }

  function handleSubmitName() {
    console.log("submitting name: ", name);
    socket.auth.username = name;
    console.log("socket.auth: ", socket.auth);
    setNameSubmitted(true)
  }

  function handleRoomChange(newRoom) {
    setRoom(newRoom)
  }

  function handleNewGame() {
    console.log("socket.auth: ", socket.auth);
    console.log("now creating game as ", socket.auth.username);
    console.log("now connecting to socket.io");
    socket.connect();
    //if nothing in localStorage, we should now get a newSession event. Does it matter if we emit 'newGame' before this has been handled? No, since all we do is 
    //save the sessionID in localStorage and add it to the socket.auth object (which will be needed for future connections but not the current one)
    console.log("now emitting newGame event");
    socket.emit("newGame");
  }

  function handleJoinGame() {
    console.log(name + ' now joining ' + room);
    console.log("now connecting to socket.io");
    socket.connect();
    //if nothing in localStorage, we should now get a newSession event. Does it matter if we emit 'joinGame' before this has been handled? No, since all we do is 
    //save the sessionID in localStorage and add it to the socket.auth object (which will be needed for future connections but not the current one)
    console.log("now emitting joinGame event");
    socket.emit("joinGame", { roomToJoin: room });
  }

  //check localStorage for sessionID
  useEffect(() => {
    //on page load, check localstorage for session id
    //if none, then we connect later on when joining / creating a game
    //need to make sure this is actually only running once

    //in response from th server, we either get
    //A) oldSession event -> need to emit a joinGame event to server and go to Buzzer if successful
    //B) no details found for sessionID -> clearLocalStorage event -> clearLocalStorage and disconnect
    //C) newSession event -> now connected with new session, set ID in localStorage and go to Home screen

    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      console.log("found a session id: ", sessionID);
      socket.auth.sessionID = sessionID;
      socket.connect();
    } else {
      console.log("no previous session id found");
    }

    socket.on("newSession", ({ sessionID, userID }) => {
      // attach the session ID to the socket for the next reconnection attempts
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID; //remove this  if not used?
      console.log("got new session event and saved sessionID to localStorage and on socket.auth");
    });

    
    socket.on("oldSession", ({ userID, roomName, oldUserName }) => {
      console.log("got old session event");
      setName(oldUserName)
      setRoom(roomName)
      setNameSubmitted(true)
      if(roomName) {
        socket.emit("joinGame", { roomToJoin: roomName });
      } else {
        console.log('old session event but no associated room')
      }
    });

    socket.on("enterGameScreen", ({ roomToJoin, username, roomAdmin }) => {
      console.log('roomAdmin: ', roomAdmin)
      console.log('username: ', username)
      if(roomAdmin === username) {
        console.log('user is admin')
        setAdmin(true);
      }
      setRoom(roomToJoin)
      console.log(name + " is entering room " + roomToJoin);
      console.log('join successful');
      setJoinedGame(true) //this should switch us to the Buzzer component
    });

    socket.on("clearLocalStorage", () => {
      console.log("clearing localStorage");
      localStorage.removeItem("sessionID");
      socket.auth = {};
      socket.disconnect();
    });

    return () => {
      console.log("removing all listeners");
      socket.removeAllListeners();
      //also delete / turn off the socket?
    };
  }, []);

  
  return (
    <div className='container'>
      { 
        joinedGame === true ? <Buzzer name={name} room={room} isAdmin={admin}/>
        : nameSubmitted === true ? <Home name={name} room={room} handleRoomChange={handleRoomChange} handleNewGame={handleNewGame} handleJoinGame={handleJoinGame}/>
        : <EnterName handleNameChange={handleNameChange} handleSubmitName={handleSubmitName} /> 
      }
    </div>
    
  );
};

export default App;
