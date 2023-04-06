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
  media_type,
  pauseWhile,
}) {
  const { videosData, setVideosData } = useData([]);
  //   const playerRef = useRef(null);

  useEffect(() => {
    setPlayerState((prev) => ({ ...prev, playing: false }));
    if (!id) return;
    if (videosData.find((e) => e.id === id)) return;
    if (pauseWhile) return;
    fetch("/api/tmdb/videos?id=" + id + "&type=" + media_type)
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

  const ButtonsComponent = ({ size }) => {
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
        {!!videosData.find((e) => e.id === id)?.videos.length && (
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
  };

  return { ButtonsComponent, videosData };
}

export default useYoutubePlayer;
