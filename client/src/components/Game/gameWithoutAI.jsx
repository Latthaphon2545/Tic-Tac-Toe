import { useState, useEffect, useContext } from "react";
import GameService from "../../services/gameSevice";
import SocketServices from "../../services/socketServices";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import classGame from "./game.module.css";

import { ShowGameState, checkWinner } from "./inGame";
import { copyToClipboard } from "../useTogether/copyToClipboard";
import SnackbarContainer from "../useTogether/Snackbar";
import BackTomain from "../useTogether/backTomain";
import HeaderContainer from "../useTogether/header";

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

  const [size, setSize] = useState(3);

  const [gameState, setGameState] = useState(() => {
    const initialGameState = Array(size)
      .fill()
      .map(() => Array(size).fill(""));
    return initialGameState;
  });

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
      checkWinner(newGameState, setWinner, setWinnerwinnerMessage, size);

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
        checkWinner(data.gameState, setWinner, setWinnerwinnerMessage, size);
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
        console.log(data);
        setListName(data.players);
        setSize(data.size);
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

  useEffect(() => {
    handleGameStart();
    handleGameUpdate();
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    setGameState(() => {
      const initialGameState = Array(size)
        .fill()
        .map(() => Array(size).fill(""));
      return initialGameState;
    });
  }, [size]);

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
        <HeaderContainer
          name1={listName[0]}
          name2={listName[1]}
          isPlayerTurn={isPlayerTurn}
          isOpponentTurn={isOpponentTurn}
          player={player}
        />
      </div>
      <ShowGameState
        gameState={gameState}
        handlePlayerClick={handlePlayerClick}
        isPlayerTurn={isPlayerTurn}
      />
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
          <SnackbarContainer
            title="Room ID copied to clipboard"
            Duration={2000}
            open={copySuccess}
          />
        </>
      )}
      <SnackbarContainer
        title={
          winnerMessage == "tie"
            ? "It's a tie"
            : `${winnerMessage == "O" ? listName[1] : listName[0]} won`
        }
        Duration={2000}
        open={openSnackbar}
      />
      {winner ? <BackTomain /> : null}
    </div>
  );
};

export default InGame;
