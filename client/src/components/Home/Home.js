import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import "./Home.css";

function Home({room, handleRoomChange}) {
  
  function handleNewGame(event) {
    event.preventDefault();
    console.log("socket.auth: ", socket.auth);
    console.log("now creating game as ", socket.auth.username);
    /*
    console.log("socket id creating new game: ", socket.id);
    console.log("now connecting to socket.io");
    socket.connect();
    console.log("now emitting newGame event");
    socket.emit("newGame");
    */
  }

  function handleJoinGame(event) {
    event.preventDefault();
    console.log("now joining game as ", socket.auth.username);
    /*
    //socket.auth.username = userName.value;
    console.log("socket id joining new game: ", socket.id);
    console.log("now connecting to socket.io");
    socket.connect();
    console.log("now emitting joinGame event to join room: ", roomName);
    socket.emit("joinGame", { roomName });
    */
  }
  

  function handleChange(event) {
    handleRoomChange(event.target.value)
  }

  /*
  useEffect(() => {
    socket.on("enterGameScreen", ({ roomName, username, admin }) => {
      console.log("admin of room is: ", admin);
      console.log(username + " is entering room " + roomName);
      console.log("navigating to game screen");
      navigate("/buzzer", { state: { roomName, username } });
    });
  }, []);
  */

  return (
    <div className="homeScreen">
      <h1 className="title">Title &#128526;</h1>
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
          <input
            id="gameCode"
            type="text"
            name="gameCode"
            required
            value={room}
            onChange={(event) => handleChange(event)}
          />
          <button type="submit" className="joinGameBtn">
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
