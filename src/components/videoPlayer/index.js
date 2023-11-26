import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Controls,
  MediaPlayer,
  MediaProvider,
  Menu,
  useMediaPlayer,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

// import "shaka-player/dist/controls.css";
import styles from "./shakaPlayer.module.scss";
import { HighQuality } from "@mui/icons-material";
import { Check, ChevronLeft, ChevronRight, MoreVertical } from "react-feather";

const playerContext = createContext(null);

const useVidPlayer = () => useContext(playerContext);

const PlayerProvider = ({ sources, children }) => {
  sources = [sources];
  const [sourceUrl, setSourceUrl] = useState(
    sources && sources.length > 0
      ? getHighestQualityUrl(sources[0])
      : {
          sourceId: "",
          url: "",
          value: "",
        }
  );

  return (
    <playerContext.Provider value={{ sources, sourceUrl, setSourceUrl }}>
      {children}
    </playerContext.Provider>
  );
};

function getHighestQualityUrl(source) {
  const maxResolution = Math.max(...Object.keys(source.stream.qualities));
  const url = source.stream.qualities[maxResolution].url;
  const sourceId = source.sourceId;
  return { sourceId, value: maxResolution + "", url };
}

function VidStackPlayer({ sources }) {
  // const sources = [
  //   {
  //     sourceId: "superstream",
  //     stream: {
  //       qualities: { 360: { url: "some url" }, 720: { url: "some url" } },
  //       type: "file",
  //       flags: ["no-cors"],
  //     },
  //   },
  // ];

  return (
    <PlayerProvider sources={sources}>
      <div style={{ position: "relative" }} className={styles.videoContainer}>
        <Player />
      </div>
    </PlayerProvider>
  );
}

function Player() {
  const { sources, sourceUrl } = useVidPlayer();

  return (
    <MediaPlayer autoplay title="" src={sourceUrl.url}>
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
      <SourceSelector />
    </MediaPlayer>
  );
}

function SourceSelector() {
  const { sources, sourceUrl } = useVidPlayer();

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 10000,
      }}
    >
      <Controls.Root style={{ position: "relative" }} className="vds-controls">
        <Menu.Root
          style={{ pointerEvents: "all" }}
          className="vds-settings-menu vds-menu"
        >
          <Menu.Button
            offset={0}
            className="vds-menu-button vds-button"
            aria-label="Settings"
          >
            <MoreVertical />
          </Menu.Button>
          <Menu.Items
            placement="bottom end"
            className="vds-settings-menu-items vds-menu-items"
          >
            {sources.map((source) => (
              <Menu.Root
                key={source.sourceId}
                className="vds-menu"
                style={{ background: "red" }}
              >
                <SubmenuButton
                  label={source.sourceId}
                  hint={sourceUrl.value + "p"}
                  // icon={HighQuality}
                />

                <SourceQualitySelector source={source} />
              </Menu.Root>
            ))}
          </Menu.Items>
        </Menu.Root>
      </Controls.Root>
    </div>
  );
}
function SubmenuButton({ label, hint, icon: Icon, disabled }) {
  return (
    <Menu.Button className="vds-menu-button" disabled={disabled}>
      <ChevronLeft className="vds-menu-button-close-icon vds-icon" />

      {/* <Icon className="vds-menu-button-icon" /> */}
      <span className="vds-menu-button-label">{label}</span>
      <span className="vds-menu-button-hint">{hint}</span>
      <ChevronRight className="vds-menu-button-open-icon vds-icon" />
    </Menu.Button>
  );
}

function SourceQualitySelector({ source }) {
  const { sourceUrl, setSourceUrl } = useVidPlayer();
  const options = Object.keys(source.stream.qualities)
    .sort((a, b) => {
      return b - a;
    })
    .map((key) => ({
      label: key + "p",
      value: key,
      select: () =>
        setSourceUrl({
          sourceId: source.sourceId,
          value: key,
          url: source.stream.qualities[key].url,
        }),
    }));
  return (
    <Menu.Items className="vds-menu-items">
      <Menu.RadioGroup className="vds-radio-group" value={sourceUrl.value}>
        {options.map(({ label, value, bitrateText, select }) => (
          <Menu.Radio
            className="vds-radio"
            value={value}
            onSelect={select}
            key={value}
          >
            <span
              style={{
                visibility: sourceUrl.value !== value ? "hidden" : "visible",
              }}
              className="vds-radio-check"
            />
            <span className="vds-radio-label">{label}</span>
            {bitrateText && (
              <span className="vds-radio-hint">{bitrateText}</span>
            )}
          </Menu.Radio>
        ))}
      </Menu.RadioGroup>
    </Menu.Items>
  );
}

export default VidStackPlayer;

// export default ShakaVideoPlayer;
