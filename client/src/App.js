import React, { useState, useEffect} from "react";
import socket from "./socket";
import "./App.css";
import EnterName from "./components/EnterName/EnterName";
import Home from "./components/Home/Home"
import Buzzer from "./components/Buzzer/Buzzer";

const App = () => {
  const [joinedGame, setJoinedGame] = useState(false);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  function handleNameChange(newName) {
    console.log('newName: ', newName)
    setName(newName)
  }

  function handleSubmitName() {
    console.log("submitting name: ", name);
    socket.auth.username = name;
    console.log("socket.auth: ", socket.auth);
    setNameSubmitted(true)
    //navigate("/home");
  }

  function handleRoomChange(newRoom) {
    console.log('newRoom: ', newRoom)
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

    //in response, we either get
    //A) oldSession event -> need to emit a joinGame event to server and go to Buzzer if successful
    //B) no details found for sessionID -> clearLocalStorage event -> clearLocalStorage and disconnect
    //C) newSession event -> now connected with new session, set ID in localStorage and go to Home screen

    //how do we conditionally load different components based on the above state?
    //if we're at first showing the enterName component, we need to lift that state up into this parent component so it can see the name
    
    socket.on("oldSession", ({ userID, roomName, oldUserName }) => {
      console.log("got old session event");
      setName(oldUserName)
      setRoom(roomName)
      setNameSubmitted(true)
      socket.emit("joinGame", { roomToJoin: roomName });
    });

    socket.on("enterGameScreen", ({ roomToJoin, username, admin }) => {
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
    <div>
      { 
        joinedGame === true ? <Buzzer name={name} room={room} />
        : nameSubmitted === true ? <Home name={name} room={room} handleRoomChange={handleRoomChange} handleNewGame={handleNewGame} handleJoinGame={handleJoinGame}/>
        : <EnterName handleNameChange={handleNameChange} handleSubmitName={handleSubmitName} /> 
      }
    </div>
    
  );
};

export default App;
