import { useState, useEffect } from "react";
import socket from "../../socket";
import "./Buzzer.css";

function Buzzer({name, room}) {
  let [users, setUsers] = useState([]);
  let [buzzerDisabled, setBuzzerDisabled] = useState(false);
  let [winner, setWinner] = useState('')
  let [emoji, setEmoji] = useState('')


  function handleBuzz() {
    //first disable the buzzer for everyone
    console.log(name + ' buzzed!')
    const random = Math.floor(Math.random() * emojis.length);

    socket.emit("buzz", {
      nameBuzzed: name,
      roomBuzzed: room,
      emojiNum: random
    });
  }

  function disableBuzzer() {
    console.log('disabling buzzer')
    setBuzzerDisabled(true)
  }

  useEffect(() => {
    socket.on("updatePlayerList", ({ users }) => {
      console.log("user array: ", users);
      setUsers(users);
    });
    socket.emit("getPlayerList");

    socket.on("buzzed", function (data) {
      disableBuzzer();
      setWinner(data.nameBuzzed)
      setEmoji(emojis[data.emojiNum])
      /*
      output.innerHTML =
        "<p id='nameText'>" +
        data.name +
        "</p><p>   buzzed first!!</p><p id='emoji'> " +
        emojis[data.emojiNum] +
        " </p>"; */
    });
  }, []);

  //if buzzer is disabled, then someone just buzzed, so we display the below

  let winnerText = (
          <div>
            <p id='nameText'>{winner}</p> <p> buzzed first!!</p>
          </div>
        )

  let buzzBackClassName = 'buzzBack';
  let buzzFrontClassName = 'buzzFront';

  if(buzzerDisabled) {
    buzzBackClassName += ' disabled-buzzBack'
    buzzFrontClassName += ' disabled-buzzFront'
  } else {
    buzzBackClassName += ' enabled-buzzBack'
    buzzFrontClassName += ' enabled-buzzFront'
  }

  /*
    function enableBuzzer() {
    buzzBack[0].disabled = false;
    buzzBack[0].classList.add("enabled-buzzBack");
    buzzBack[0].classList.remove("disabled-buzzBack");
    buzzFront[0].classList.add("enabled-buzzFront");
    buzzFront[0].classList.remove("disabled-buzzFront");
    resetBtn.disabled = true;
    resetBtn.classList.remove("enabled-reset");
    resetBtn.classList.add("disabled-reset");
  }

    function disableBuzzer() {
      buzzBack[0].disabled = true;
      buzzBack[0].classList.add("disabled-buzzBack");
      buzzBack[0].classList.remove("enabled-buzzBack");
      buzzFront[0].classList.add("disabled-buzzFront");
      buzzFront[0].classList.remove("enabled-buzzFront");
      resetBtn.disabled = false;
      resetBtn.classList.add("enabled-reset");
      resetBtn.classList.remove("disabled-reset");
    }
  */

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
        <div className="output">
          {buzzerDisabled ? winnerText : null}
        </div>
      </div>
      <button className={buzzBackClassName} onClick={handleBuzz} disabled={buzzerDisabled}>
        <span className={buzzFrontClassName}>B</span>
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
