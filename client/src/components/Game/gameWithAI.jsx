import { useState, useEffect } from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { db } from "../../confic/firebase";
import { collection, addDoc } from "firebase/firestore";

import {
  isBoardFull,
  checkWinner,
  formatTime,
} from "../useTogether/useTogether";

import classGame from "./game.module.css";

const InGameWithAI = ({ PlayerName }) => {
  const [player, setPlayer] = useState("X");
  const [opositePlayer, setOpositePlayer] = useState("O");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isOpponentTurn, setIsOpponentTurn] = useState(false);
  const [winnerMessage, setWinnerwinnerMessage] = useState("");
  const [winner, setWinner] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [startTime, setStartTime] = useState(null);

  const [playerNames, setPlayerNames] = useState(PlayerName);

  const [gameState, setGameState] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const minimax = (board, depth, isMaximizingPlayer) => {
    let winner = checkWinner(board, setWinner, setWinnerwinnerMessage);

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
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === "") {
            board[i][j] = opositePlayer;
            let score = minimax(board, depth + 1, false);
            board[i][j] = "";
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === "") {
            board[i][j] = player;
            let score = minimax(board, depth + 1, true);
            board[i][j] = "";
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  };

  const findBestMove = (board) => {
    let bestVal = -1000;
    let bestMove = { i: -1, j: -1 };

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          board[i][j] = opositePlayer;
          let moveVal = minimax(board, 0, false);
          board[i][j] = "";
          if (moveVal > bestVal) {
            bestMove = { i, j };
            bestVal = moveVal;
          }
        }
      }
    }

    return bestMove;
  };

  const aiMove = () => {
    let move = findBestMove(gameState);
    let newGameState = [...gameState];
    newGameState[move.i][move.j] = opositePlayer;
    setGameState(newGameState);
    const winner = checkWinner(newGameState, setWinner, setWinnerwinnerMessage);
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

      if (!checkWinner(newGameState, setWinner, setWinnerwinnerMessage)) {
        setIsPlayerTurn(false);
        setIsOpponentTurn(true);
        setTimeout(() => {
          aiMove();
        }, 1000);
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
    // alert("winner is " + winnerMessage + "\nBack to main menu");
    setOpenSnackbar(true);
    // window.location.href = "/";
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
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
        <div>
          <h3
            style={{
              color: isPlayerTurn ? "white" : isOpponentTurn ? "gray" : "white",
            }}
          >
            X
          </h3>
          <p
            style={{
              color: isPlayerTurn ? "white" : isOpponentTurn ? "gray" : "white",
            }}
          >
            {playerNames}
          </p>
        </div>
        <div>
          <h3
            style={{
              color: isPlayerTurn ? "gray" : isOpponentTurn ? "white" : "white",
            }}
          >
            O
          </h3>
          <p
            style={{
              color: isPlayerTurn ? "gray" : isOpponentTurn ? "white" : "white",
            }}
          >
            AI
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
                    id={`Slot${rowIndex * 3 + colIndex + 1}`}
                    onClick={(e) => handlePlayerClick(e, rowIndex, colIndex)}
                  ></input>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%", backgroundColor: "black", color: "white" }}
        >
          {winnerMessage == "tie"
            ? "It's a tie"
            : `${winnerMessage == "O" ? "AI" : playerNames} won`}
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

export default InGameWithAI;
