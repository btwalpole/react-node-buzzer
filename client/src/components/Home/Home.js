import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";

function Home() {
  /*
  const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      console.log("found a session id: ", sessionID);
      socket.auth.sessionID = sessionID;
      socket.connect();
    } else {
      console.log("no previous session id found");
    }
  */
  let navigate = useNavigate();

  function handleNewGame(event) {
    event.preventDefault();
    console.log("socket.auth: ", socket.auth);
    console.log("now creating game as ", socket.auth.username);
    //socket.auth.username = userName.value;
    console.log("socket id creating new game: ", socket.id);
    console.log("now connecting to socket.io");
    socket.connect();
    console.log("now emitting newGame event");
    socket.emit("newGame");
  }

  function handleJoinGame(event) {
    event.preventDefault();
    console.log("now joining game as ", socket.auth.username);
    //socket.auth.username = userName.value;
    console.log("socket id joining new game: ", socket.id);
    console.log("now connecting to socket.io");
    socket.connect();
    console.log("now emitting joinGame event");
    socket.emit("joinGame");
  }

  useEffect(() => {
    socket.on("enterGameScreen", ({ admin }) => {
      console.log("admin of room is: ", admin);
      console.log("navigating to /sid=12324+roomID=ABCGD");
      //navigate("/");
    });
  }, []);

  return (
    <div className="homeScreen">
      <h1 className="title">Benji's Cool Quiz Buzzer &#128526;</h1>
      <a
        className="logoAttribution"
        href="https://www.freepik.com/vectors/isometric-illustration"
      >
        <img className="logo" src="quizLogo.jpg" />
      </a>
      <div className="homeForms">
        <h2 className="welcome">
          Hi <span className="homeUserName"></span>
        </h2>
        <form onSubmit={(event) => handleNewGame(event)}>
          <button type="submit" className="newGameButton">
            Create New Game
          </button>
        </form>
        <h2>OR</h2>
        <form
          className="joinGameForm"
          onSubmit={(event) => handleJoinGame(event)}
        >
          <label htmlFor="gameCode">Enter Game Code:</label>
          <input id="gameCode" type="text" name="gameCode" required />
          <button type="submit" className="joinGameBtn">
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
