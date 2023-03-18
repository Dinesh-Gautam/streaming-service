import React, { useEffect } from "react";
import YouTube from "react-youtube";
import styles from "./youtubePlayer.module.scss";
function YoutubeVideoPlayer({
  videoId,
  playerRef,
  playerState,
  setPlayerState,
}) {
  const opts = {
    host: "http://www.youtube.com",
    height: "1080",
    width: "1920",
    playerVars: {
      controls: 0,
      autoplay: 0,
      origin: "http://localhost:3000",
      modestbranding: 1,
      disablekb: 1,
      enablejsapi: 1,
    },
  };
  return (
    <div className={styles.container}>
      <YouTube
        style={{
          opacity: playerState.playing ? 1 : 0,
        }}
        videoId={videoId}
        opts={opts}
        onReady={(event) => (playerRef.current = event.target)}
        onStateChange={(event) => {
          console.log(event);
          if (event.data === 0) {
            setPlayerState((prev) => ({ ...prev, playing: false }));
          }
        }}
      />
    </div>
  );
}

export default YoutubeVideoPlayer;
