import { io } from "socket.io-client";

// URL on dev laptop
//const URL = "http://localhost:5000";

//URL on gitpod
//const URL = "https://5000-btwalpole-reactnodebuzz-sm1gmvmjrdp.ws-eu47.gitpod.io/"

//URL on heroku
const URL = "https://awesome-quiz-buzzer.herokuapp.com/";
const socket = io(URL, { autoConnect: false, auth: {} });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
