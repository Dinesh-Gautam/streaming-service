import { useData } from "@/context/stateContext";
import {
  Pause,
  PlayArrow,
  VolumeOff,
  VolumeUpRounded,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import YoutubeVideoPlayer from "../youtubeVideoPlayer";
import styles from "./useYoutubePlayer.module.scss";
function useYoutubePlayer({
  playerRef,
  playerState,
  setPlayerState,
  setId,
  id,
}) {
  const { videosData, setVideosData } = useData([]);
  //   const playerRef = useRef(null);

  useEffect(() => {
    setPlayerState((prev) => ({ ...prev, playing: false }));
    if (!id) return;
    if (videosData.find((e) => e.id === id)) return;

    fetch("/api/tmdb/videos?id=" + id)
      .then((e) => e.json())
      .then(({ data }) => {
        setVideosData((prev) => [
          ...prev,
          {
            id,
            videos: data
              .filter((video) => video.official && video.type === "Trailer")
              .sort((a, b) => {
                return new Date(a.published_at) - new Date(b.published_at);
              }),
          },
        ]);
      })
      .catch((e) => console.error(e));
  }, [id]);

  useEffect(() => {
    console.log(videosData);
  }, [videosData]);

  const ButtonsComponent = () => {
    return (
      <div className={styles.videoControls}>
        {playerState.playing && (
          <button
            onClick={() => {
              const muteState = playerRef.current.isMuted();
              muteState ? playerRef.current.unMute() : playerRef.current.mute();
              setPlayerState((prev) => ({
                ...prev,
                muted: !muteState,
              }));
            }}
          >
            {playerState.muted ? <VolumeOff /> : <VolumeUpRounded />}
          </button>
        )}
        {!!videosData.find((e) => e.id === id)?.videos.length && (
          <button
            onClick={() => {
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
            {playerState.playing ? <Pause /> : <PlayArrow />}
          </button>
        )}
      </div>
    );
  };

  return { ButtonsComponent, videosData };
}

export default useYoutubePlayer;
