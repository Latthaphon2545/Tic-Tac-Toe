import { useState, useEffect, useContext } from "react";
import GameService from "../../services/gameSevice";
import SocketServices from "../../services/socketServices";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import classGame from "./game.module.css";

import { copyToClipboard, checkWinner } from "../useTogether/useTogether";

const socketServices = new SocketServices();
const gameService = new GameService();

const InGame = ({ PlayerName }) => {
  const [player, setPlayer] = useState("");
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isOpponentTurn, setIsOpponentTurn] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [playerNames, setPlayerNames] = useState(PlayerName);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [listName, setListName] = useState([]);

  const [copySuccess, setCopySuccess] = useState("");

  const [startTime, setStartTime] = useState(null);

  const [gameState, setGameState] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const [winnerMessage, setWinnerwinnerMessage] = useState("");
  const [winner, setWinner] = useState(null);

  const handlePlayerClick = async (e, row, col) => {
    if (!isPlayerTurn) {
      return;
    }

    const newGameState = [...gameState];
    if (gameState[row][col] === "" && !winner) {
      newGameState[row][col] = player;
      setGameState(newGameState);
      checkWinner(newGameState, setWinner, setWinnerwinnerMessage);

      const socket = socketServices.getSocket();
      if (socket) {
        gameService.updatedGame(socket, newGameState);
      }
    }
  };

  const handleGameUpdate = () => {
    const socket = socketServices.getSocket();
    if (socket) {
      gameService.onGameUpdated(socket, (data) => {
        setGameState(data.gameState);
        checkWinner(data.gameState, setWinner, setWinnerwinnerMessage);
        setIsPlayerTurn(!isPlayerTurn);
        setIsOpponentTurn(!isOpponentTurn);
      });
    }
  };

  const handleGameStart = () => {
    const socket = socketServices.getSocket();
    gameService.onStartGame(socket, (data) => {
      setPlayer(data.symbol);
      setIsPlayerTurn(data.strat);
      setRoomId(data.roomId);
      socket.emit("player_name", { name: playerNames, roomId: data.roomId });
      socket.on("name_each_room", (data) => {
        setListName(data.players);
      });
    });
  };

  const sucsessToSaveDatabase = () => {
    const socket = socketServices.getSocket();
    socket.emit("player_won", {
      winnerMessage,
      roomId,
      startTime: startTime,
    });

    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
    setCopySuccess(false);
  };

  useEffect(() => {
    handleGameStart();
    handleGameUpdate();
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    handleGameStart();
    handleGameUpdate();
  }, [gameState]);

  useEffect(() => {
    if (winner) {
      sucsessToSaveDatabase();
    }
  }, [winner]);

  return (
    <div className={classGame.InGame}>
      <div className={classGame.header}>
        <div>
          <h3
            style={{
              color: `${isPlayerTurn && player === "X" ? "white" : "gray"}`,
            }}
          >
            X
          </h3>
          <p
            style={{
              color: `${isPlayerTurn && player === "X" ? "white" : "gray"}`,
            }}
          >
            {listName[0]}
          </p>
        </div>
        <div>
          <h3
            style={{
              color: `${isOpponentTurn && player === "O" ? "white" : "gray"}`,
            }}
          >
            O
          </h3>
          <p
            style={{
              color: `${isOpponentTurn && player === "O" ? "white" : "gray"}`,
            }}
          >
            {listName[1] ? listName[1] : "Waiting..."}
          </p>
        </div>
      </div>
      <table>
        <tbody>
          {gameState.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    border: `6px solid ${
                      isPlayerTurn ? "white" : "transparent"
                    }`,
                  }}
                >
                  <input
                    type="button"
                    value={cell}
                    id={`${rowIndex * 3 + colIndex + 1}`}
                    onClick={(e) => handlePlayerClick(e, rowIndex, colIndex)}
                  ></input>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={classGame.buttonRoom}>
        {!winner && (
          <>
            <h3>Room ID: {roomId}</h3>
            <button
              onClick={copyToClipboard.bind(this, roomId, setCopySuccess)}
            >
              Copy Room ID
            </button>
          </>
        )}
      </div>
      {copySuccess && (
        <>
          <Snackbar open={copySuccess} autoHideDuration={2000}>
            <Alert
              severity="success"
              sx={{ width: "100%", backgroundColor: "black", color: "white" }}
            >
              Room ID copied to clipboard
            </Alert>
          </Snackbar>
        </>
      )}
      <Snackbar open={openSnackbar} autoHideDuration={2000}>
        <Alert
          severity="success"
          sx={{ width: "100%", backgroundColor: "black", color: "white" }}
        >
          {winnerMessage == "tie"
            ? "It's a tie"
            : `${winnerMessage == "O" ? listName[1] : listName[0]} won`}
        </Alert>
      </Snackbar>
      {winner ? (
        <div>
          <h3
            onClick={() => {
              window.location.href = "/main";
            }}
            style={{ color: "white", cursor: "pointer" }}
          >
            Back to main menu
          </h3>
        </div>
      ) : null}
    </div>
  );
};

export default InGame;
