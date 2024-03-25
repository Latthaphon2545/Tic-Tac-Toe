import { Socket } from "socket.io-client";

var roomIDCurrect;

class GameService {
  async joinRoom(socket, roomId, size) {
    return new Promise((resolve, reject) => {
      socket.emit("join_game", { roomId, size });
      roomIDCurrect = roomId;
      socket.on("join_room_success", () => {
        resolve(true);
      });
      socket.on("join_room_error", (error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  async updatedGame(socket, gameState) {
    socket.emit("update_game", { gameState: gameState, roomId: roomIDCurrect });
  }

  async onGameUpdated(socket, callback) {
    socket.on("on_game_updated", (data) => {
      callback(data);
    });
  }

  async onStartGame(socket, callback) {
    socket.on("start_game", (data) => {
      callback(data);
    });
  }
}

export default GameService;
