import { useState, useEffect } from "react";
import socket from "../../socket";

function Home() {

  function handleNewGame(event) {
    event.preventDefault();
    console.log("now creating game as ", socket.auth.username);
    //socket.auth.username = userName.value;
    console.log("socket id creating new game: ", socket.id);
    console.log("now connecting to socket.io");
    socket.connect();
    console.log("now emitting newGame event");
    socket.emit("newGame");
  }

  return (
    <div className="homeScreen">
      <h1 className='title'>Benji's Cool Quiz Buzzer &#128526;</h1>
      <a className='logoAttribution' href='https://www.freepik.com/vectors/isometric-illustration'>
          <img className='logo' src='quizLogo.jpg' />
      </a>
      <div className="homeForms">
          <h2 className="welcome">Hi <span className="homeUserName"></span></h2>
          <form onsubmit={event => handleNewGame(event)}>
              <button
                  type="submit"
                  className="newGameButton"
              >
              Create New Game
              </button>
          </form>
          <h2>OR</h2>
          <form className='joinGameForm' onsubmit="event.preventDefault();">
              <label for="gameCode">Enter Game Code:</label>
              <input id="gameCode" type="text" name="gameCode" required/> 
              <button
                  type="submit"
                  className="joinGameBtn"
              >
              Join Game
              </button>
          </form>
      </div>
    </div>
    
  );
}

export default Home;
