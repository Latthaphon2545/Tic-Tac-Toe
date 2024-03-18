import io from "socket.io-client";

const URL = "http://localhost:5173";

const socket = io(URL);

var muSocketID;

socket.on("creatnewgame", () => {
  muSocketID = statusUpdate.socketID;
  console.log("Connected to server");
});

export default {
  socket: socket,
  muSocketID: muSocketID,
};
