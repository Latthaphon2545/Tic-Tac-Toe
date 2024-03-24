import { io } from "socket.io-client";

var socketCurrent;

class SocketServices {
  connect = (url) => {
    return new Promise((resolve, reject) => {
      this.socket = io(url);

      if (!this.socket) {
        return reject("Error connecting to socket");
      }
      

      this.socket.on("connect", () => {
        resolve(this.socket);
        socketCurrent = this.socket;
      });

      this.socket.on("connect_error", (error) => {
        console.log("Error connecting to socket", error);
        reject(error);
      });
    });
  };

  getSocket = () => {
    return socketCurrent;
  };
}

export default SocketServices;
