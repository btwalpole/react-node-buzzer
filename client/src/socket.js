import { io } from "socket.io-client";

const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false, auth: {} });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
