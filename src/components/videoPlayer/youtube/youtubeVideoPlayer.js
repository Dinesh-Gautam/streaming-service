import React, { useEffect, useMemo, useRef } from "react";
import YouTube from "react-youtube";
import styles from "./youtubePlayer.module.scss";
import { useYoutubePlayer } from "./youtubePlayerContext";
function YoutubeVideoPlayer({ roundedBorder }) {
  const { videosData, playerRef, playerState, setPlayerState, id } =
    useYoutubePlayer();
  const videoId = videosData.find((e) => e.id === id)?.videos[0]?.key;

  const opts = useRef({
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
      mute: playerState.muted,
    },
  });

  useEffect(() => {
    return () => {
      if (!playerRef.current) return;
      try {
        playerRef.current.unloadModule();
      } catch (e) {
        console.log(e);
      }
      playerRef.current.destroy();
      console.log("destroying youtube player");
    };
  }, []);

  return (
    videosData.length > 0 &&
    videosData.find((e) => e.id === id) && (
      <div className={styles.container}>
        {((!playerRef.current ||
          playerRef.current?.playerInfo?.videoData?.video_id !== videoId) &&
          videoId &&
          console.log("rendering", videoId)) || (
          <YouTube
            style={{
              opacity: playerState.playing ? 1 : 0,
              borderRadius: roundedBorder ? 12 : 0,
              overflow: "hidden",
            }}
            videoId={videoId}
            opts={opts.current}
            onReady={(event) => {
              playerRef.current = event.target;
            }}
            onStateChange={(event) => {
              console.log(event);
              if (event.data === 0) {
                setPlayerState((prev) => ({ ...prev, playing: false }));
              }
            }}
          />
        )}
      </div>
    )
  );
}

export default YoutubeVideoPlayer;
