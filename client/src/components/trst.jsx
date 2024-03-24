import React, { useEffect, useRef, useState } from "react";

import { storage } from "../confic/firebase";
import { ref, uploadBytes } from "firebase/storage";

function ScreenRecorder({ PlayerName }) {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const mediaRecorder = useRef(null);

  const [showConfirm, setShowConfirm] = useState(true);

  const startRecording = async () => {
    if (
      window.confirm(
        "Do you want to recording the screen? and save to database?"
      )
    ) {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
      });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = handleDataAvailable;
      mediaRecorder.current.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  };

  const handleDataAvailable = async (e) => {
    if (e.data.size > 0) {
      const url = URL.createObjectURL(e.data);
      setVideoUrl(url);
      console.log(url);

      // get url vedio to upload to storage
      const blob = new Blob([e.data], { type: "video/webm" });
      console.log(blob);

      // add to storage
      const video = ref(storage, `video/${PlayerName}@${Date.now()}`);
      uploadBytes(video, blob);
    }
  };

  useEffect(() => {
    if (showConfirm) {
      if (
        window.confirm(
          "Do you want to recording the screen? and save to database?"
        )
      ) {
        startRecording();
        setShowConfirm(false);
      }
    }
  }, [showConfirm]);

  // if reload page stop recording
  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      if (recording) {
        stopRecording();
      }
    });
  }, [recording]);

  return (
    <div>
      <button
        style={{
          backgroundColor: recording ? "red" : "gray",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "30px",
        }}
      >
        {recording ? "Stop Recording" : "No Recording"}
      </button>
    </div>
  );
}

export default ScreenRecorder;
