import { useState, useEffect } from "react";
import socket from "../../socket";
import Button from "../Button/Button";
import "./Buzzer.css";

function Buzzer({ name, room, isAdmin }) {
  console.log("isAdmin: ", isAdmin);
  //when we first load the Buzzer we want to check if the user is admin, if so then we render the reset button
  let [users, setUsers] = useState([]);
  let [buzzerDisabled, setBuzzerDisabled] = useState(false);
  let [winner, setWinner] = useState("");
  //let [emoji, setEmoji] = useState("");

  function handleBuzz() {
    //first disable the buzzer for everyone
    console.log(name + " buzzed!");
    const random = Math.floor(Math.random() * emojis.length);

    socket.emit("buzz", {
      nameBuzzed: name,
      roomBuzzed: room,
      emojiNum: random,
    });
  }

  function handleReset() {
    socket.emit("reset", { roomReset: room });
  }

  function disableBuzzer() {
    console.log("disabling buzzer");
    setBuzzerDisabled(true);
  }

  useEffect(() => {
    socket.on("updatePlayerList", ({ users }) => {
      console.log("user array: ", users);
      setUsers(users);
    });
    socket.emit("getPlayerList");

    //need to also get correct buzzer state on first load
    socket.on("buzzerState", function ({ buzzerEnabled }) {
      console.log("got buzzerState event: ", buzzerEnabled);
      if (buzzerEnabled) {
        setBuzzerDisabled(false);
        console.log("enabling buzzer");
      } else {
        disableBuzzer();
        console.log("disabling buzzer");
      }
    });
    socket.emit("getBuzzerState");

    socket.on("buzzed", function (data) {
      disableBuzzer();
      setWinner(data.nameBuzzed);
      //setEmoji(emojis[data.emojiNum]);
    });

    socket.on("reset", () => {
      setBuzzerDisabled(false);
    });
  }, []);

  //if buzzer is disabled, then someone just buzzed, so we display the below
  let winnerText = winner ? (
    <div className="winnerText">
      <p className="nameText">{winner} </p> <p> buzzed first!!</p>
    </div>
  ) : null;

  let buzzBackClassName = "buzzBack";
  let buzzFrontClassName = "buzzFront";
  let resetClassName = "";
  if (buzzerDisabled) {
    buzzBackClassName += " disabled-buzzBack";
    buzzFrontClassName += " disabled-buzzFront";
    //resetClassName += " enabled-reset";
  } else {
    buzzBackClassName += " enabled-buzzBack";
    buzzFrontClassName += " enabled-buzzFront";
    resetClassName = "disabled-reset";
  }

  return (
    <div className="gameScreen">
      {isAdmin ? (
        <Button
          className={resetClassName}
          disabled={!buzzerDisabled}
          onClick={handleReset}
        >
          Reset
        </Button>
      ) : null}
      <h1>
        Your game code: <span className="gameCodeDisplay">{room}</span>
      </h1>
      <div className="nameContainer">
        <h1>
          Name: <span className="name">{name}</span>
        </h1>
      </div>

      <div className="display">{buzzerDisabled ? winnerText : null}</div>
      <button
        className={buzzBackClassName}
        onClick={handleBuzz}
        disabled={buzzerDisabled}
      >
        <span className={buzzFrontClassName}>BUZZ ME</span>
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

const emojis = [
  "&#128512;",
  "&#128526;",
  "&#128519;",
  "&#128587;&#127998;",
  "&#128591;&#127998;",
  "&#128680;",
  "&#128718;",
  "&#129310;",
  "&#129305;&#127996;",
  "&#129322;",
  "&#129335;",
  "&#129351;",
  "&#129365;",
  "&#129419;",
  "&#129425;",
  "&#129428;",
  "&#129504;",
  "&#128170;&#127996;",
  "&#11088;",
  "&#127752;",
  "&#127790;",
  "&#127803;",
  "&#127850;",
];
