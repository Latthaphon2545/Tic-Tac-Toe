export const isBoardFull = (board) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === "") {
        return false;
      }
    }
  }
  return true;
};

export const checkWinner = (gameState, setWinner, setWinnerMessage, size) => {
    for (let i = 0; i < size; i++) {
        if (new Set(gameState[i]).size === 1 && gameState[i][0] !== "") {
            setWinnerMessage(gameState[i][0]);
            setWinner(true);
            return gameState[i][0];
        }
    }

    for (let i = 0; i < size; i++) {
        const column = gameState.map(row => row[i]);
        if (new Set(column).size === 1 && column[0] !== "") {
            setWinnerMessage(column[0]);
            setWinner(true);
            return column[0];
        }
    }

    const mainDiagonal = gameState.map((row, i) => row[i]);
    const secondaryDiagonal = gameState.map((row, i) => row[size - i - 1]);

    if (new Set(mainDiagonal).size === 1 && mainDiagonal[0] !== "") {
        setWinnerMessage(mainDiagonal[0]);
        setWinner(true);
        return mainDiagonal[0];
    }

    if (new Set(secondaryDiagonal).size === 1 && secondaryDiagonal[0] !== "") {
        setWinnerMessage(secondaryDiagonal[0]);
        setWinner(true);
        return secondaryDiagonal[0];
    }

    if (gameState.flat().every(cell => cell !== "")) {
        setWinnerMessage("Tie");
        setWinner(true);
        return "tie";
    }

    setWinner(false);
    return null;
};


export const ShowGameState = ({
  gameState,
  handlePlayerClick,
  isPlayerTurn,
}) => {
  return (
    <table>
      <tbody>
        {gameState.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td
                key={colIndex}
                style={{
                  border: `6px solid ${isPlayerTurn ? "white" : "transparent"}`,
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
  );
};
