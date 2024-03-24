import React, { useContext, useState } from "react";
import GameContext from "../../services/gameContext";
import GameService from "../../services/gameSevice";
import SocketServices from "../../services/socketServices";
import { v4 as uuidv4 } from "uuid";

const socketServices = new SocketServices();
const gameService = new GameService();

import classJoin from "./joinRoom.module.css";

import Loupe from "../../img/loupe.png";

function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [showFindRoom, setShowFindRoom] = useState(false);

  const { isInRoom, setInRoom, isPlayWithAI, setPlayWithAI } =
    useContext(GameContext);

  const handleRoomIdChange = (e) => {
    const value = e.target.value;
    setRoomId(value);
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    setIsJoining(true);

    const socket = socketServices.getSocket();

    if (!roomId || roomId.trim() === "" || !socket) {
      return;
    }

    useTogether(socket, roomId);
  };

  const createRoom = async () => {
    const socket = socketServices.getSocket();
    if (!socket) {
      return;
    }

    const id = uuidv4();
    setRoomId(id);

    useTogether(socket, id);
  };

  const useTogether = async (socket, id) => {
    try {
      const joined = await gameService.joinRoom(socket, id);

      if (joined) {
        setInRoom(true);
      }
    } catch (error) {
      alert(error.error);
    } finally {
      setIsJoining(false);
    }
  };

  const handlePlayWithAI = () => {
    setPlayWithAI(true);
  };

  return (
    <div className={classJoin.Join}>
      <button onClick={createRoom} disabled={isJoining}>
        Create Room
      </button>
      <button onClick={handlePlayWithAI}>Play with AI</button>
      <div className={classJoin.findButton}>
        <button
          className={classJoin.findButton}
          onClick={() => setShowFindRoom(!showFindRoom)}
        >
          <img
            src={Loupe}
            alt="buttonpng"
            border="0"
            style={{
              width: "7vh",
            }}
          />
        </button>
      </div>
      {showFindRoom && (
        <form>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={handleRoomIdChange}
          />
          <button onClick={joinRoom} disabled={isJoining}>
            {isJoining ? "Joining..." : "Join"}
          </button>
        </form>
      )}
    </div>
  );
}

export default JoinRoom;
