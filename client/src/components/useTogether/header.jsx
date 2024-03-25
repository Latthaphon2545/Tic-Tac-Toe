import React from "react";

export default function HeaderContainer({ name1, name2, isPlayerTurn, isOpponentTurn,player }) {
  return (
    <>
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
          {name1}
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
          {name2 ? name2 : "Waiting..."}
        </p>
      </div>
    </>
  );
}
