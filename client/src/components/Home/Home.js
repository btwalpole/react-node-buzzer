import { useState, useEffect } from "react";
import socket from "../../socket";
import "./Home.css";

function Home({name, room, handleRoomChange, handleNewGame, handleJoinGame}) {
  const [roomValid, setRoomValid] = useState(true)
  
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
    handleRoomChange(event.target.value)
  }

  useEffect(() => {
    socket.on("noSuchRoom", (roomName) => {
      setRoomValid(false)
      console.log("entered room " + roomName + " does not exist");
    });
  }, [])

  const errorMsg = (
    <p className="roomInvalid">No such room exists!</p>
  )

  return (
    <div className="homeScreen">
      <h1 className="title">Epic Quiz Buzzer</h1>
      <a
        className="logoAttribution"
        href="https://www.freepik.com/vectors/isometric-illustration"
      >
        <img className="logo" src="quizLogo.jpg" />
      </a>
      <div className="homeForms">
        <h2 className="welcome">
          Hi <span className="homeUserName">{name}</span>!
        </h2>
        <form onSubmit={(event) => handleNewGameSubmit(event)}>
          <button type="submit" className="newGameButton">
            Create New Game
          </button>
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
          <button type="submit" className="joinGameBtn">
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
