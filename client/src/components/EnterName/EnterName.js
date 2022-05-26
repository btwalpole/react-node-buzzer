import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import "./EnterName.css";

function EnterName({name, handleNameChange}) {
  //let [name, setName] = useState("");
  //let navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    console.log("submitting name: ", name);
    socket.auth.username = name;
    console.log("socket.auth: ", socket.auth);
    //navigate("/home");
  }

  function handleChange(event) {
    handleNameChange(event.target.value)
  }

  return (
    <div className="enterNameScreen">
      <form className="enterNameForm" onSubmit={(event) => handleSubmit(event)}>
        <label htmlFor="userName">Enter your name:</label>
        <input
          id="userName"
          type="text"
          name="userName"
          required
          value={name}
          onChange={(event) => handleChange(event)}
        />
        <button type="submit" className="submitNameBtn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default EnterName;
