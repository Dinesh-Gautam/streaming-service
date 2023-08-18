import React, { useEffect, useRef } from "react";
import "shaka-player/dist/controls.css";
import styles from "./shakaPlayer.module.scss";

const shaka = require("shaka-player/dist/shaka-player.ui.js");

import mux from "mux.js";

if (!window.muxjs) {
  window.muxjs = mux;
}

function ShakaVideoPlayer({ manifestUrl }) {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const playerRef = useRef(null);
  useEffect(() => {
    if (playerRef.current) return;
    var manifestUri = manifestUrl;

    let video = videoRef.current;
    let videoContainer = videoContainerRef.current;

    if (!video || !videoContainer) {
      console.error("Refs are null");
      return;
    }
    playerRef.current = new shaka.Player(video);
    const player = playerRef.current;
    const ui = new shaka.ui.Overlay(player, videoContainer, video);
    const controls = ui.getControls();

    console.log(Object.keys(shaka.ui));

    const onError = (error) => {
      // Log the error.
      console.error("Error code", error.code, "object", error);
    };
    console.log(controls);
    player
      .load(manifestUri)
      .then(function () {
        // This runs if the asynchronous load is successful.
        console.log("The video has now been loaded!");
      })
      .catch(onError); // onError is executed if the asynchronous load fails.
  }, []);

  return (
    <div
      //   className="shadow-lg mx-auto max-w-full"
      ref={videoContainerRef}
      className={styles.videoContainer + " videoContainer"}
    >
      <video
        id="video"
        ref={videoRef}
        autoPlay={true}
        className={styles.video}
        // className="w-full h-full"
        // poster={this.props.posterUrl}
      ></video>
    </div>
  );
}

export default ShakaVideoPlayer;
