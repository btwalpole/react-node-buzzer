import "./EnterName.css";

function EnterName({name, handleNameChange, handleSubmitName}) {
  //let [name, setName] = useState("");
  //let navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    handleSubmitName();
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
          maxlength="15"
          pattern="^[a-zA-Z]\p{L}+$"
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
