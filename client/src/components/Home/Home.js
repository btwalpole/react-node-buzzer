import { useState, useEffect } from "react";
import socket from "../../socket";
import "./Home.css";

function Home({name, room, handleRoomChange, handleNewGame, handleJoinGame}) {
  
  function handleNewGameSubmit(event) {
    event.preventDefault();
    handleNewGame();
  }

  function handleJoinGameSubmit(event) {
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
    handleJoinGame();
  }
  
  function handleChange(event) {
    handleRoomChange(event.target.value)
  }

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
          Hi <span className="homeUserName">{name}!</span>
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
          <button type="submit" className="joinGameBtn">
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
