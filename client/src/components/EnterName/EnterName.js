import { useEffect } from "react";
import socket from "../../socket";

function EnterName() {
  useEffect(() => {
    //on page load, check localstorage for session id
    //if none, then we connect later on joining/ crating a game
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      console.log("found a session id: ", sessionID);
      socket.auth.sessionID = sessionID;
      socket.connect();
    } else {
      console.log("no previous session id found");
    }
  });

  return <h1>Enter Name Screen</h1>;
}

export default EnterName;
