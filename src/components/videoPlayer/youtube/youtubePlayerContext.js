import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useData } from "../../../context/stateContext";

const videoPlayerContext = createContext({});

export function useYoutubePlayer() {
  return useContext(videoPlayerContext);
}

function YoutubeVideoPlayerProvider({ id, media_type, children }) {
  const playerRef = useRef(null);
  const [playerState, setPlayerState] = useState({ playing: false });
  const { videosData, setVideosData } = useData([]);
  const [videoPlayerReady, setVideoPlayerReady] = useState(false);
  const contextValues = {
    playerRef,
    playerState,
    setPlayerState,
    id,
    media_type,
    videosData,
    setVideosData,
    videoPlayerReady,
    setVideoPlayerReady,
  };

  useEffect(() => {
    setPlayerState((prev) => ({ ...prev, playing: false }));
    if (!id) return;
    if (videosData.find((e) => e.id === id)) return;
    // if (pauseWhile) return;
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
  return (
    <videoPlayerContext.Provider value={contextValues}>
      {children}
    </videoPlayerContext.Provider>
  );
}

export default YoutubeVideoPlayerProvider;
