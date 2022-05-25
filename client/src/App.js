import React, { useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import EnterName from "./components/EnterName/EnterName";
import Home from "./components/Home/Home"
import Buzzer from "./components/Buzzer/Buzzer";

const App = () => {
  const [joinedGame, setJoinedGame] = useState(false);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoomName] = useState('');

  //check localStorage for sessionID
  useEffect(() => {
    //on page load, check localstorage for session id
    //if none, then we connect later on when joining / creating a game
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

    socket.on("oldSession", ({ userID, roomName, oldUserName }) => {
      socket.userID = userID;
      socket.roomName = roomName;
      socket.username = oldUserName;
      console.log("got old session event");
      socket.emit("joinGame", { roomName });
    });

    socket.on("enterGameScreen", ({ roomName, username, admin }) => {
      console.log(username + " is entering room " + roomName);
      //navigate("/buzzer", { state: { roomName, username } });
      console.log('join successful');
      setName(username)
      setRoomName(roomName)
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
      socket.userID = userID;
      console.log("got new session event");
    });

    return () => {
      console.log("unmounting enterName - removing all listeners");
      socket.removeAllListeners();
    };
  }, []);
  return (
    <div>
      {joinedGame === true ? <Buzzer name={name} room={room}/>
        : nameSubmitted == true ? <Home />
        : <EnterName />
      }
    </div>
    
  );
};

export default App;
