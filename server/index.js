const express = require("express");
const app = express();
const htpp = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const { db } = require("./firebaseConfic");
const { collection, addDoc } = require("firebase/firestore");

app.use(cors());

const server = htpp.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

var playerNames = {};

var renderCount = 0;

var sizeTable = 3;

io.on("connection", async (socket) => {
  socket.on("join_game", async (message) => {
    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
    const socketsRoom = Array.from(socket.rooms.values()).filter(
      (room) => room !== socket.id
    );

    if (
      socketsRoom.length > 0 ||
      (connectedSockets && connectedSockets.size === 2)
    ) {
      socket.emit("join_room_error", {
        error: "User is already in a room",
      });
    } else {
      renderCount = 0;
      await socket.join(message.roomId);
      socket.emit("join_room_success");
      if (io.sockets.adapter.rooms.get(message.roomId).size === 1) {
        sizeTable = message.size;
        socket.emit("start_game", {
          strat: true,
          symbol: "X",
          roomId: message.roomId,
        });
      } else if (io.sockets.adapter.rooms.get(message.roomId).size === 2) {
        socket.emit("start_game", {
          strat: false,
          symbol: "O",
          roomId: message.roomId,
        });
      }
    }
  });

  socket.on("update_game", (message) => {
    const room = io.sockets.adapter.rooms.get(message.roomId);
    if (room) {
      io.to(message.roomId).emit("on_game_updated", {
        gameState: message.gameState,
      });
    } else {
      console.log(`Room ${room} does not exist`);
    }
  });

  socket.on("player_won", async (data) => {
    if (renderCount === 0) {
      renderCount++;
      const historyCollection = collection(db, "history");
      const timeToPlay = formatTime(
        (new Date() - new Date(data.startTime)) / 1000
      );
      await addDoc(historyCollection, {
        player1: playerNames[data.roomId][0],
        player2: playerNames[data.roomId][1],
        winner:
          data.winnerMessage === "O"
            ? playerNames[data.roomId][1]
            : playerNames[data.roomId][0] || "Tie",
        date: new Date(data.startTime),
        timeToplay: timeToPlay,
      });
    }
  });

  socket.on("player_name", (data) => {
    if (!playerNames[data.roomId]) {
      playerNames[data.roomId] = [];
    }
    if (!playerNames[data.roomId].includes(data.name)) {
      playerNames[data.roomId].push(data.name);
    }

    const room = io.sockets.adapter.rooms.get(data.roomId);
    if (!room) {
      delete playerNames[data.roomId];
    }

    io.to(data.roomId).emit("name_each_room", {
      players: playerNames[data.roomId],
      size: sizeTable,
    });
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num) => (num < 10 ? "0" + num : num);

  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}
