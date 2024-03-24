import { useEffect, useState } from "react";

import SocketServices from "../../services/socketServices";
const socketServices = new SocketServices();

import HistoryImg from "../../img/history.png";

import GameContext from "../../services/gameContext";

import JoinRoom from "./joinroom";
import InGame from "../Game/gameWithoutAI";

import classMain from "./main.module.css";
import InGameWithAI from "../Game/gameWithAI";

import { db } from "../../confic/firebase";
import { collection, getDocs } from "firebase/firestore";

const historyCollection = collection(db, "history");

const Main = () => {
  const [isInRoom, setInRoom] = useState(false);
  const [isPlayWithAI, setPlayWithAI] = useState(false);
  const [isHistoryUI, setHistoryUI] = useState(false);
  const [PlayerName, setPlayerName] = useState("");

  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const [history, setHistory] = useState([]);

  const connectToSocket = async () => {
    try {
      const socket = await socketServices.connect("http://localhost:3001");
    } catch (error) {
      console.log("Error connecting to socket", error);
    }
  };

  const getInfo = async () => {
    const history = await getDocs(historyCollection);
    var historyData = [];
    history.forEach((doc) => {
      historyData.push(doc.data());
    });

    historyData.sort((a, b) => b.date.toDate() - a.date.toDate());

    setHistory(historyData);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const convertDate = (date) => {
    const d = date.toDate();
    if (isNaN(d.getTime())) {
      // date is not valid
      return "Invalid date";
    } else {
      // date is valid
      return d.toDateString();
    }
  };

  useEffect(() => {
    connectToSocket();
    setPlayerName(randomName());
    getInfo();
  }, []);

  const randomName = () => {
    const names = [
      "John Doe",
      "Jane Doe",
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Heidi",
      "Ivan",
      "Judy",
      "Mallory",
      "Oscar",
      "Peggy",
      "Walter",
      "Wendy",
    ];
    const adjectives = [
      "Awesome",
      "Brave",
      "Clever",
      "Daring",
      "Energetic",
      "Friendly",
      "Gentle",
      "Happy",
      "Intelligent",
      "Joyful",
      "Kind",
      "Loyal",
      "Magical",
      "Noble",
      "Optimistic",
      "Playful",
      "Quick",
      "Resourceful",
      "Smart",
      "Talented",
      "Unique",
      "Vibrant",
      "Witty",
      "Xtraordinary",
      "Youthful",
      "Zealous",
    ];
    const randomNameIndex = Math.floor(Math.random() * names.length);
    const randomAdjectiveIndex = Math.floor(Math.random() * adjectives.length);
    const randomName = names[randomNameIndex];
    const randomAdjective = adjectives[randomAdjectiveIndex];
    return `${randomAdjective} ${randomName}`;
  };

  return (
    <div className={`${classMain.Main}`}>
      <div>
        {!isInRoom && !isPlayWithAI && (
          <>
            <h1>Tic Tac Toe</h1>
            <input
              type="text"
              placeholder="Enter Name"
              onChange={(e) => setPlayerName(e.target.value || randomName())}
            />
          </>
        )}
        <GameContext.Provider
          value={{ isInRoom, setInRoom, isPlayWithAI, setPlayWithAI }}
        >
          {!isInRoom & !isPlayWithAI && <JoinRoom disabled={!PlayerName} />}
          {isInRoom && <InGame PlayerName={PlayerName} />}
          {isPlayWithAI && <InGameWithAI PlayerName={PlayerName} />}
        </GameContext.Provider>
      </div>
      {!isInRoom && !isPlayWithAI && (
        <button
          className={classMain.historybutton}
          onClick={() => setHistoryUI(!isHistoryUI)}
        >
          <img
            src={HistoryImg}
            alt="buttonpng"
            border="0"
            style={{
              width: "7vh",
            }}
          />
        </button>
      )}
      {isHistoryUI && (
        <div>
          {history.map((game, index) => (
            <div className={classMain.container} key={game.id || index}>
              <h2 className={classMain.title}>History</h2>
              <div className={classMain.date}>
                <input
                  type="date"
                  onChange={handleDateChange}
                  value={selectedDate}
                />
              </div>
              {history
                .filter((game) => {
                  // If a date is selected, only show games from that date
                  if (selectedDate) {
                    const gameDate = new Date(game.date.toDate());
                    const gameDateString = `${gameDate.getFullYear()}-${String(
                      gameDate.getMonth() + 1
                    ).padStart(2, "0")}-${String(gameDate.getDate()).padStart(
                      2,
                      "0"
                    )}`;

                    return gameDateString === selectedDate;
                  }

                  return true;
                })
                .map((game, index) => (
                  <div
                    key={game.id || index}
                    className={classMain.containerEach}
                  >
                    <div className={classMain.detailContain}>
                      <p>{game.player1}</p>
                      <p
                        style={{
                          fontSize: "2.5rem",
                          fontWeight: "bold",
                          color: "red",
                        }}
                      >
                        VS
                      </p>
                      <p>{game.player2}</p>
                    </div>
                    <div className={classMain.winner}>
                      <p>👑</p>
                      <p>{game.winner ? `${game.winner}` : "Draw"}</p>
                      <p>time for play : {game.timeToplay}</p>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Main;
