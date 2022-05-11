import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";

function EnterName() {
  let [name, setName] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
    //on page load, check localstorage for session id
    //if none, then we connect later on joining/ crating a game

    /* WILL SET THIS UP LATER 
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      console.log("found a session id: ", sessionID);
      socket.auth.sessionID = sessionID;
      socket.connect();
    } else {
      console.log("no previous session id found");
    }
    */
  });

  function handleSubmit(event) {
    event.preventDefault();
    console.log("name: ", name);
    socket.auth.username = name;
    navigate('/home')
  }

  return (
    <div className="enterNameScreen">
      <form className="enterNameForm" onSubmit={event => handleSubmit(event)}>
        <label htmlFor="userName">Enter your name:</label>
        <input id="userName" type="text" name="userName" required value={name} onChange={event => setName(event.target.value)}/>
        <button type="submit" className="submitNameBtn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default EnterName;
