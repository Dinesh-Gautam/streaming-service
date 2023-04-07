import { createContext, useContext, useRef, useState } from "react";
import { useData } from "../../../context/stateContext";

const videoPlayerContext = createContext({});

export function useYoutubePlayer() {
  return useContext(videoPlayerContext);
}

function YoutubeVideoPlayerProvider({ id, media_type, children }) {
  const playerRef = useRef(null);
  const [playerState, setPlayerState] = useState({ playing: false });
  const { videosData, setVideosData } = useData([]);
  const contextValues = {
    playerRef,
    playerState,
    setPlayerState,
    id,
    media_type,
    videosData,
    setVideosData,
  };
  return (
    <videoPlayerContext.Provider value={contextValues}>
      {children}
    </videoPlayerContext.Provider>
  );
}

export default YoutubeVideoPlayerProvider;
