import './Buzzer.css'
import {useLocation} from 'react-router-dom';

function Buzzer() {
  const location = useLocation();
  let {roomName, username } = location.state;
  console.log('location: ', location)
  console.log('roomName: ', roomName)
  console.log('username: ', username)

  return (
    <div className="gameScreen">
      <button className="reset disabled-reset" disabled={true}>
        Reset
      </button>
      <h1>
        Your game code: <span className="gameCodeDisplay">{roomName}</span>
      </h1>
      <div className="nameContainer">
        <h1>
          Name: <span className="name">{username}</span>
        </h1>
      </div>

      <div className="display">
        <div className="output"></div>
      </div>
      <button className="enabled-buzzBack buzzBack">
        <span className="enabled-buzzFront buzzFront">BUZZ ME BABY</span>
      </button>
      <div className="playersContainer">
        <h2>Players:</h2>
        <ul className="players"></ul>
      </div>
    </div>
  );
}

export default Buzzer;
