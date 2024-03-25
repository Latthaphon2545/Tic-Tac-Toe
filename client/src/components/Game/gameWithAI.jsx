import { useState, useEffect } from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { db } from "../../confic/firebase";
import { collection, addDoc } from "firebase/firestore";

import { isBoardFull, checkWinner, ShowGameState } from "./inGame";
import { formatTime } from "../useTogether/fotmatTime";

import classGame from "./game.module.css";
import ScreenRecorder from "../../record/vedio";
import HeaderContainer from "../useTogether/header";
import SnackbarContainer from "../useTogether/Snackbar";

const InGameWithAI = ({ PlayerName, size }) => {
  const [player, setPlayer] = useState("X");
  const [opositePlayer, setOpositePlayer] = useState("O");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isOpponentTurn, setIsOpponentTurn] = useState(false);
  const [winnerMessage, setWinnerwinnerMessage] = useState("");
  const [winner, setWinner] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [startTime, setStartTime] = useState(null);

  const [playerNames, setPlayerNames] = useState(PlayerName);

  const [gameState, setGameState] = useState(() => {
    const initialGameState = Array(size)
      .fill()
      .map(() => Array(size).fill(""));
    return initialGameState;
  });

  const minimax = (board, depth, alpha, beta, isMaximizingPlayer, size, startTime) => {

    if(new Date() - startTime > 5000){
      return 0;
    }


    let winner = checkWinner(board, setWinner, setWinnerwinnerMessage, size);
    

    if (winner !== null) {
      if (winner === opositePlayer) {
        return 10 - depth;
      } else if (winner === player) {
        return depth - 10;
      } else {
        return 0;
      }
    }

    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board[i][j] === "") {
            board[i][j] = opositePlayer;
            let score = minimax(board, depth + 1, alpha, beta, false, size, startTime);
            board[i][j] = "";
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) {
              break;
            }
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board[i][j] === "") {
            board[i][j] = player;
            let score = minimax(board, depth + 1, alpha, beta, true, size, startTime);
            board[i][j] = "";
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) {
              break;
            }
          }
        }
      }
      return bestScore;
    }
  };

  const findBestMove = (board, size) => {
    let bestVal = -Infinity;
    let bestMove = { i: -1, j: -1 };
    let alpha = -Infinity;
    let beta = Infinity;
    const startTime = new Date();

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === "") {
          board[i][j] = opositePlayer;
          let moveVal = minimax(board, 0, alpha, beta, false, size, startTime);
          board[i][j] = "";
          if (moveVal > bestVal) {
            bestMove = { i, j };
            bestVal = moveVal;
          }
          alpha = Math.max(alpha, bestVal);
        }
      }
    }

    return bestMove;
  };

  const aiMove = () => {
    let move = findBestMove(gameState, size);
    let newGameState = [...gameState];
    newGameState[move.i][move.j] = opositePlayer;
    setGameState(newGameState);
    const winner = checkWinner(
      newGameState,
      setWinner,
      setWinnerwinnerMessage,
      size
    );
    if (!winner && !isBoardFull(newGameState)) {
      setIsPlayerTurn(true);
      setIsOpponentTurn(false);
    }
  };

  const handlePlayerClick = (e, row, col) => {
    if (gameState[row][col] === "" && !winner) {
      let newGameState = [...gameState];
      newGameState[row][col] = player;
      setGameState(newGameState);

      if (!checkWinner(newGameState, setWinner, setWinnerwinnerMessage, size)) {
        setIsPlayerTurn(false);
        setIsOpponentTurn(true);
        aiMove();
      }
    }
  };

  const saveGameToFirebase = async () => {
    const historyCollection = collection(db, "history");
    const timeToPlay = formatTime((new Date() - startTime) / 1000);
    await addDoc(historyCollection, {
      player1: playerNames,
      player2: "AI",
      winner: (winnerMessage === "O" ? "AI" : playerNames) || "Tie",
      date: startTime,
      timeToplay: timeToPlay,
    });

    console.log("Game saved to firebase");
    setOpenSnackbar(true);
  };

  useEffect(() => {
    const start = new Date();
    setStartTime(start);
    console.log("Game started at", start);
  }, []);

  useEffect(() => {
    if (winner) {
      saveGameToFirebase();
    }
  }, [winner]);

  return (
    <div className={classGame.InGame}>
      <div className={classGame.header}>
        <HeaderContainer
          name1={playerNames}
          name2="AI"
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
      <br />
      <SnackbarContainer
        title={
          winnerMessage == "tie"
            ? "It's a tie"
            : `${winnerMessage == "O" ? "AI" : playerNames} won`
        }
        Duration={2000}
        open={openSnackbar}
      />
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
      <ScreenRecorder PlayerName={`${PlayerName}VSAI`} winner={winner} />
    </div>
  );
};

export default InGameWithAI;
