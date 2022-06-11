import { useState, useEffect } from "react";
import socket from "../../socket";
import Button from "../Button/Button";
import "./Home.css";

function Home({ name, room, handleRoomChange, handleNewGame, handleJoinGame }) {
  const [roomValid, setRoomValid] = useState(true);

  function handleNewGameSubmit(event) {
    event.preventDefault();
    handleNewGame();
  }

  function handleJoinGameSubmit(event) {
    event.preventDefault();
    console.log("now joining game as ", socket.auth.username);
    handleJoinGame();
  }

  function handleChange(event) {
    handleRoomChange(event.target.value);
  }

  useEffect(() => {
    socket.on("noSuchRoom", (roomName) => {
      setRoomValid(false);
      console.log("entered room " + roomName + " does not exist");
    });
  }, []);

  const errorMsg = <p className="roomInvalid">No such room exists!</p>;

  return (
    <div className="homeScreen">
      <h1 className="title">Epic Quiz Buzzer</h1>
      <a
        className="logoAttribution"
        href="https://www.freepik.com/vectors/isometric-illustration"
        alt="buzzer logo"
      >
        <img className="logo" src="quizLogo.jpg" alt="quizLogo" />
      </a>
      <div className="homeForms">
        <h2 className="welcome">
          Hi <span className="homeUserName">{name}</span>!
        </h2>
        <form onSubmit={(event) => handleNewGameSubmit(event)}>
          <Button type="submit" className="homeButton">
            Create New Game
          </Button>
        </form>
        <h2>OR</h2>
        <form
          className="joinGameForm"
          onSubmit={(event) => handleJoinGameSubmit(event)}
        >
          <label htmlFor="gameCode">Enter Game Code:</label>
          <input
            id="gameCode"
            type="text"
            name="gameCode"
            required
            value={room}
            onChange={(event) => handleChange(event)}
          />
          {!roomValid ? errorMsg : null}
          <Button type="submit" className="homeButton">
            Join Game
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Home;
