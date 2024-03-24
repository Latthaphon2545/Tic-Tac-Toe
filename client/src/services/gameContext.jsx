import React, { useState } from 'react';

const GameContext = React.createContext();

export function GameProvider({ children }) {
  const [isPlayWithAI, setPlayWithAI] = useState(false);
  const [isInRoom, setInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState('x');
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);

  return (
    <GameContext.Provider value={{
      isPlayWithAI, setPlayWithAI,
      isInRoom, setInRoom,
      playerSymbol, setPlayerSymbol,
      isPlayerTurn, setIsPlayerTurn,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export default GameContext;