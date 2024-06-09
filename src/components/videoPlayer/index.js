import React from "react";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

// import "shaka-player/dist/controls.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
import styles from "./shakaPlayer.module.scss";

function VidStackPlayer({ manifestUrl }) {
  return (
    <div style={{ position: "relative" }} className={styles.videoContainer}>
      <Player manifestUrl={manifestUrl} />
    </div>
  );
}

function Player({ manifestUrl }) {
  return (
    <MediaPlayer className={styles.container} src={manifestUrl}>
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}
export default VidStackPlayer;
