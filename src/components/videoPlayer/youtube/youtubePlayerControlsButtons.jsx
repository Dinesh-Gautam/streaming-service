import {
  Pause,
  PlayArrow,
  VolumeOff,
  VolumeUpRounded,
} from "@mui/icons-material";
import React, { useEffect } from "react";
import styles from "./youtubeControlButtons.module.scss";
import { useYoutubePlayer } from "./youtubePlayerContext";

function YoutubeControlButtons({ size }) {
  const {
    playerRef,
    playerState,
    setPlayerState,
    id,
    media_type,
    videosData,
    setVideosData,
    videoPlayerReady,
  } = useYoutubePlayer();

  const height = size === "large" ? 68 : 42;
  const width = height;
  return (
    <div className={styles.videoControls}>
      {playerState.playing && (
        <button
          style={{
            height,
            width,
          }}
          onClick={() => {
            if (!playerRef.current) return;
            const muteState = playerRef.current.isMuted();
            muteState ? playerRef.current.unMute() : playerRef.current.mute();
            setPlayerState((prev) => ({
              ...prev,
              muted: !muteState,
            }));
          }}
        >
          {playerState.muted ? (
            <VolumeOff fontSize={size || "small"} />
          ) : (
            <VolumeUpRounded fontSize={size || "small"} />
          )}
        </button>
      )}
      {!!videosData.find((e) => e.id === id)?.videos.length &&
        videoPlayerReady && (
          <button
            style={{
              height,
              width,
            }}
            onClick={() => {
              if (!playerRef.current) return;

              if (!playerState.playing) {
                playerRef.current.playVideo();
                setPlayerState((prev) => ({
                  ...prev,
                  playing: true,
                }));
              }
              if (playerState.playing) {
                playerRef.current.pauseVideo();
                setPlayerState((prev) => ({
                  ...prev,
                  playing: false,
                }));
              }
            }}
            // disabled={currentIndex !== index}
          >
            {playerState.playing ? (
              <Pause fontSize={size || "small"} />
            ) : (
              <PlayArrow fontSize={size || "small"} />
            )}
          </button>
        )}
    </div>
  );
}

export default YoutubeControlButtons;
