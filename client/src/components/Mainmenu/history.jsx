import { useState } from "react";

import { storage } from "../../confic/firebase";
import { ref, getDownloadURL } from "firebase/storage";

import classMain from "./main.module.css";

const HistoryScreen = ({ history, isHistoryUI }) => {
  const [isVideoPlay, setisVideoPlay] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleWatchVideo = async (
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
      alert("No recorded video found");
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

  return (
    <div className={`${classMain.Main}`}>
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
                      {game.player2 === "AI" ? (
                        <button
                          onClick={() =>
                            handleWatchVideo(
                              game.player1,
                              game.player2,
                              setVideoUrl,
                              setisVideoPlay
                            )
                          }
                        >
                          Watch Video
                        </button>
                      ) : null}
                      {isVideoPlay ? (
                        <>
                          <div className={classMain.videoContainer}>
                            <video src={videoUrl} controls autoPlay />
                            <button onClick={() => setisVideoPlay(false)}>
                              Back
                            </button>
                          </div>
                        </>
                      ) : null}
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

export default HistoryScreen;
