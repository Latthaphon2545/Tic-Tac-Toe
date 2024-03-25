import { storage } from "../../confic/firebase";
import { ref, getDownloadURL } from "firebase/storage";

export const copyToClipboard = (roomId, setCopySuccess) => {
  navigator.clipboard.writeText(roomId);
  setCopySuccess("Copied!");

  setTimeout(() => {
    setCopySuccess("");
  }, 1000);
};

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

export const checkWinner = (gameState, setWinner, setWinnerwinnerMessage) => {
  const lines = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (
      gameState[a[0]][a[1]] &&
      gameState[a[0]][a[1]] === gameState[b[0]][b[1]] &&
      gameState[a[0]][a[1]] === gameState[c[0]][c[1]]
    ) {
      setWinnerwinnerMessage(gameState[a[0]][a[1]]);
      setWinner(true);
      return gameState[a[0]][a[1]];
    }
  }

  if (isBoardFull(gameState)) {
    setWinnerwinnerMessage("Tie");
    setWinner(true);
    return "tie";
  }

  setWinner(false);

  return null;
};

export const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num) => (num < 10 ? "0" + num : num);

  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

export const handleWatchVideo = async (
  player1,
  player2,
  setVideoUrl,
  setisVideoPlay
) => {
  const videoUrl = await getVideoUrl(player1, player2);
  if (videoUrl) {
    setVideoUrl(videoUrl);
    setisVideoPlay(true);
  } else {
    alert("No video found");
  }
};

const getVideoUrl = async (player1, player2) => {
  try {
    const videoRef = ref(storage, `video/${player1}VS${player2}`);
    const url = await getDownloadURL(videoRef);
    return url;
  } catch (error) {
    console.log("Error getting video url", error);
    return null;
  }
};
