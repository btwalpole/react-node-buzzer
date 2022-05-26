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

    //in response, we either get
    //A) oldSession event -> need to emit a joinGame event to server and go to Buzzer if successful
    //B) no details found for sessionID -> clearLocalStorage event -> clearLocalStorage and disconnect
    //C) newSession event -> now connected with new session, set ID in localStorage and go to Home screen

    //how do we conditionally load different components based on the above state?
    //if we're at first showing the enterName component, we need to lift that state up into this parent component so it can see the name
    /*
    socket.on("oldSession", ({ userID, roomName, oldUserName }) => {
      socket.userID = userID;
      socket.roomName = roomName;
      socket.username = oldUserName;
      console.log("got old session event");
      socket.emit("joinGame", { roomName });
    });

    socket.on("enterGameScreen", ({ roomName, username, admin }) => {
      console.log(name + " is entering room " + roomName);
      //navigate("/buzzer", { state: { roomName, username } });
      console.log('join successful');
      setRoom(roomName)
      //need to wait for the above two to complete before setting the below??
      setJoinedGame(true)
    });

    socket.on("clearLocalStorage", () => {
      console.log("clearing localStorage");
      localStorage.removeItem("sessionID");
      socket.auth = {};
      socket.disconnect();
    });

    socket.on("newSession", ({ sessionID, userID }) => {
      // attach the session ID to the socket for the next reconnection attempts
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID; //remove this  if not used?
      console.log("got new session event");
    });

    return () => {
      console.log("removing all listeners");
      socket.removeAllListeners();
      //also delete / turn off the socket?
    };

    */
  }, []);

  
  return (
    <div>
      { 
        joinedGame === true ? <Buzzer name={name} room={room} />
        : nameSubmitted === true ? <Home name={name} room={room} handleRoomChange={handleRoomChange} />
        : <EnterName handleNameChange={handleNameChange} handleSubmitName={handleSubmitName} /> 
      }
    </div>
    
  );
};

export default App;
