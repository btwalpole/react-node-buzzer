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

  return (
    <div className="enterNameScreen">
      <form className="enterNameForm" onsubmit="event.preventDefault();">
        <label for="userName">Enter your name:</label>
        <input id="userName" type="text" name="userName" required />
        <button type="submit" class="submitNameBtn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default EnterName;
