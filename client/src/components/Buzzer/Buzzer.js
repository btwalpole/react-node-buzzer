import { useState, useEffect } from "react";
import socket from "../../socket";
import "./Buzzer.css";
//import { useLocation } from "react-router-dom";

function Buzzer({name, room}) {
  //const location = useLocation();
  //let { roomName, username } = location.state;
  let [users, setUsers] = useState([]);

  useEffect(() => {
    console.log(
      "running useEffect in Buzzer.js to set up UpdatePLayerList Listener"
    );
    socket.on("updatePlayerList", ({ users }) => {
      console.log("user array: ", users);
      setUsers(users);
    });

    console.log(
      "emitting getPlayerList to server now that updatePLayerList listener is ready"
    );
    socket.emit("getPlayerList");
  }, []);

  return (
    <div className="gameScreen">
      <button className="reset disabled-reset" disabled={true}>
        Reset
      </button>
      <h1>
        Your game code: <span className="gameCodeDisplay">{room}</span>
      </h1>
      <div className="nameContainer">
        <h1>
          Name: <span className="name">{name}</span>
        </h1>
      </div>

      <div className="display">
        <div className="output"></div>
      </div>
      <button className="enabled-buzzBack buzzBack">
        <span className="enabled-buzzFront buzzFront">B</span>
      </button>
      <div className="playersContainer">
        <h2>Players:</h2>
        <ul className="players">
          {users.map((user) => (
            <li>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Buzzer;
