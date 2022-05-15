function Buzzer() {
  return (
    <div className="gameScreen">
      <button className="reset" class="disabled-reset" disabled="true">
        Reset
      </button>
      <h1>
        Your game code: <span className="gameCodeDisplay"></span>
      </h1>
      <div className="nameContainer">
        <h1>
          Name: <span className="name"></span>
        </h1>
      </div>

      <div className="display">
        <div className="output"></div>
      </div>
      <button class="enabled-buzzBack buzzBack">
        <span class="enabled-buzzFront buzzFront">BUZZ ME BABY</span>
      </button>
      <div className="playersContainer">
        <h2>Players:</h2>
        <ul className="players"></ul>
      </div>
    </div>
  );
}

export default Buzzer;