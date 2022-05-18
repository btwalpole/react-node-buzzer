import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import './EnterName.css'

function EnterName() {
  let [name, setName] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    //on page load, check localstorage for session id
    //if none, then we connect later on joining/ crating a game
    //NEED TO ADD THIS TO EVERY PAGE?
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      console.log("found a session id: ", sessionID);
      socket.auth.sessionID = sessionID;
      socket.connect();
    } else {
      console.log("no previous session id found");
    }

    socket.on("oldSession", ({ userID, roomName, oldUserName }) => {
      socket.userID = userID;
      socket.roomName = roomName;
      socket.username = oldUserName;
      console.log("got old session event");
      socket.emit("joinGame", { roomName });
    });

    socket.on("enterGameScreen", ({ roomName, username, admin }) => {
      console.log("admin of room is: ", admin);
      console.log(username + ' is entering room ' + roomName)
      console.log("navigating to /sid=12324+roomID=ABCGD");
      navigate("/buzzer", {state: {roomName, username}});
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
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    console.log("submitting name: ", name);
    socket.auth.username = name;
    console.log("socket.auth: ", socket.auth);
    navigate("/home");
  }

  return (
    <div className="enterNameScreen">
      <form className="enterNameForm" onSubmit={(event) => handleSubmit(event)}>
        <label htmlFor="userName">Enter your name:</label>
        <input
          id="userName"
          type="text"
          name="userName"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit" className="submitNameBtn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default EnterName;
