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

import HistoryScreen from "./history";

const historyCollection = collection(db, "history");

const Main = () => {
  const [isInRoom, setInRoom] = useState(false);
  const [isPlayWithAI, setPlayWithAI] = useState(false);
  const [isHistoryUI, setHistoryUI] = useState(false);
  const [PlayerName, setPlayerName] = useState("");
  const [size, setSize] = useState(3);

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

  useEffect(() => {
    connectToSocket();
    setPlayerName(randomName());
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
      <div className={`${classMain.Main}`}>
        {!isInRoom && !isPlayWithAI && (
          <>
            <h1>Tic Tac Toe</h1>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              onChange={(e) => setPlayerName(e.target.value || randomName())}
            />
            <label>Border Size</label>
            <input
              type="number"
              placeholder="Enter Board Size"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              max={6}
              min={3}
            />
          </>
        )}
        <GameContext.Provider
          value={{ isInRoom, setInRoom, isPlayWithAI, setPlayWithAI }}
        >
          {!isInRoom & !isPlayWithAI && (
            <JoinRoom disabled={!PlayerName} size={size} />
          )}
          {isInRoom && <InGame PlayerName={PlayerName} />}
          {isPlayWithAI && <InGameWithAI PlayerName={PlayerName} size={size} />}
        </GameContext.Provider>
      </div>
      {!isInRoom && !isPlayWithAI && (
        <button
          className={classMain.historybutton}
          onClick={() => {
            setHistoryUI(!isHistoryUI);
            getInfo();
          }}
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
        <HistoryScreen
          history={history}
          isHistoryUI={isHistoryUI}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
        />
      )}
    </div>
  );
};

export default Main;
