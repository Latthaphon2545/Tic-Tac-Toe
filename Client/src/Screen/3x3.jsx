import { useState, useEffect } from "react";
import { handleClick } from "../interraction/interractXO";

const TrTable = () => {
  const [playerOne, setPlayerOne] = useState("");
  const [playerTwo, setPlayerTwo] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState(playerOne);

  const [gameState, setGameState] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const [slot1, setSlot1] = useState("Slot1");
  const [slot2, setSlot2] = useState("Slot2");
  const [slot3, setSlot3] = useState("Slot3");
  const [slot4, setSlot4] = useState("Slot4");
  const [slot5, setSlot5] = useState("Slot5");
  const [slot6, setSlot6] = useState("Slot6");
  const [slot7, setSlot7] = useState("Slot7");
  const [slot8, setSlot8] = useState("Slot8");
  const [slot9, setSlot9] = useState("Slot9");

  const [winner, setWinner] = useState("");

  const checkWinner = (gameState) => {
    for (let i = 0; i < 3; i++) {
      if (
        gameState[i][0] === gameState[i][1] &&
        gameState[i][1] === gameState[i][2] &&
        gameState[i][0] !== ""
      ) {
        setWinner(gameState[i][0]);
        return gameState[i][0];
      }
    }

    // check columns
    for (let i = 0; i < 3; i++) {
      if (
        gameState[0][i] === gameState[1][i] &&
        gameState[1][i] === gameState[2][i] &&
        gameState[0][i] !== ""
      ) {
        setWinner(gameState[0][i]);
        return gameState[0][i];
      }
    }

    // check diagonals
    if (
      gameState[0][0] === gameState[1][1] &&
      gameState[1][1] === gameState[2][2] &&
      gameState[0][0] !== ""
    ) {
      setWinner(gameState[0][0]);
      return gameState[0][0];
    }

    if (
      gameState[0][2] === gameState[1][1] &&
      gameState[1][1] === gameState[2][0] &&
      gameState[0][2] !== ""
    ) {
      setWinner(gameState[0][2]);
      return gameState[0][2];
    }

    return null;
  };

  const randomizePlayer = (setPlayerOne, setPlayerTwo) => {
    // random choice X or O
    const random = Math.random() < 0.5 ? "O" : "X";
    if (random === "O") {
      setPlayerOne("X");
      setPlayerTwo("O");
      setCurrentPlayer("X");
    } else if (random === "X") {
      setPlayerOne("O");
      setPlayerTwo("X");
      setCurrentPlayer("O");
    }
  };

  const handlePlayerClick = (e, id, setValue) => {
    handleClick(e, id, currentPlayer, setValue);
    setCurrentPlayer(currentPlayer === playerOne ? playerTwo : playerOne);

    // Update game state
    const slotNumber = parseInt(id.replace("Slot", "")) - 1;
    const row = Math.floor(slotNumber / 3);
    const col = slotNumber % 3;
    const newGameState = [...gameState];
    newGameState[row][col] = currentPlayer;
    setGameState(newGameState);

    checkWinner(gameState);
    var score = minimax(gameState, 0, true, currentPlayer);
    console.log("score", score);
  };

  const isBoardFull = () => {
    for (let i = 0; i < gameState.length; i++) {
      for (let j = 0; j < gameState[i].length; j++) {
        if (gameState[i][j] === "") {
          return false;
        }
      }
    }
    return true;
  };

  const minimax = (gameState, depth, isMaximizingPlayer, player) => {
    // หลังจากนี้ค่อยทำ
  };

  useEffect(() => {
    randomizePlayer(setPlayerOne, setPlayerTwo);
  }, []);

  return (
    <div className="TrTable">
      <h1>3X3</h1>
      <table>
        <tbody>
          <tr>
            <td>
              <input
                type="button"
                value={slot1}
                id="Slot1"
                onClick={(e) => handlePlayerClick(e, "Slot1", setSlot1)}
              ></input>
            </td>
            <td>
              <input
                type="button"
                value={slot2}
                id="Slot2"
                onClick={(e) => handlePlayerClick(e, "Slot2", setSlot2)}
              ></input>
            </td>
            <td>
              <input
                type="button"
                value={slot3}
                id="Slot3"
                onClick={(e) => handlePlayerClick(e, "Slot3", setSlot3)}
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="button"
                value={slot4}
                id="Slot4"
                onClick={(e) => handlePlayerClick(e, "Slot4", setSlot4)}
              ></input>
            </td>
            <td>
              <input
                type="button"
                value={slot5}
                id="Slot5"
                onClick={(e) => handlePlayerClick(e, "Slot5", setSlot5)}
              ></input>
            </td>
            <td>
              <input
                type="button"
                value={slot6}
                id="Slot6"
                onClick={(e) => handlePlayerClick(e, "Slot6", setSlot6)}
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="button"
                value={slot7}
                id="Slot7"
                onClick={(e) => handlePlayerClick(e, "Slot7", setSlot7)}
              ></input>
            </td>
            <td>
              <input
                type="button"
                value={slot8}
                id="Slot8"
                onClick={(e) => handlePlayerClick(e, "Slot8", setSlot8)}
              ></input>
            </td>
            <td>
              <input
                type="button"
                value={slot9}
                id="Slot9"
                onClick={(e) => handlePlayerClick(e, "Slot9", setSlot9)}
              ></input>
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        <h2>Game State</h2>
        <pre>
          {gameState.map((row, i) => (
            <div key={i}>
              {row.map((cell, j) => (
                <span key={j}>{cell || "-"}</span>
              ))}
            </div>
          ))}
        </pre>
      </div>

      <div>
        <h2>Winner</h2>
        <p>{winner}</p>
      </div>
    </div>
  );
};

export default TrTable;
