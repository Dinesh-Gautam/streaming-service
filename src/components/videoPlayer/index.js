import React, { useEffect, useRef } from "react";

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
import { MoreVertical } from "react-feather";

function VidStackPlayer({ sources }) {
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current) {
    }
  }, [playerRef]);

  return (
    <div style={{ position: "relative" }} className={styles.videoContainer}>
      <MediaPlayer
        ref={playerRef}
        title="Sprite Fight"
        src={[
          {
            src: "https://media-files.vidstack.io/hls/index.m3u8",
            type: "application/x-mpegurl",
          },
        ]}
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
        <SourceSelector />
      </MediaPlayer>
    </div>
  );
}

function SourceSelector() {
  const player = useMediaPlayer();

  const options = [
    {
      label: "1080p",
      value: "1080",
      bitrateText: "10 mbps",
      select: () => {},
    },
    {
      label: "1080p",
      value: "1080",
      bitrateText: "10 mbps",
      select: () => {},
    },
    {
      label: "1080p",
      value: "1080",
      bitrateText: "10 mbps",
      select: () => {},
    },
    {
      label: "1080p",
      value: "1080",
      bitrateText: "10 mbps",
      select: () => {},
    },
    {
      label: "1080p",
      value: "1080",
      bitrateText: "10 mbps",
      select: () => {},
    },
    {
      label: "1080p",
      value: "1080",
      bitrateText: "10 mbps",
      select: () => {},
    },
    {
      label: "1080p",
      value: "1080",
      bitrateText: "10 mbps",
      select: () => {},
    },
  ];

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
            <Menu.Root className="vds-menu" style={{ background: "red" }}>
              <SubmenuButton
                label="Quality"
                hint={"1080p"}
                disabled={options.disabled}
                // icon={HighQuality}
              />
              <Menu.Items className="vds-quality-menu vds-menu-items">
                <Menu.RadioGroup
                  className="vds-radio-group"
                  value={options.selectedValue}
                >
                  {options.map(({ label, value, bitrateText, select }) => (
                    <Menu.Radio
                      className="vds-radio"
                      value={value}
                      onSelect={select}
                      key={value}
                    >
                      <div className="vds-radio-check" />
                      <span className="vds-radio-label">{label}</span>
                      {bitrateText ? (
                        <span className="vds-radio-hint">{bitrateText}</span>
                      ) : null}
                    </Menu.Radio>
                  ))}
                </Menu.RadioGroup>
              </Menu.Items>
            </Menu.Root>

            {/* <Menu.Root>
              <SubmenuButton
                label="Quality"
                hint={"1080p"}
                disabled={options.disabled}
                // icon={HighQuality}
              />
              <Menu.Content
                placement={"top start"}
               
              >
                <Menu.RadioGroup
                  className="vds-radio-group"
                  value={options.selectedValue}
                >
                  {options.map(({ label, value, bitrateText, select }) => (
                    <Menu.Radio
                      className="vds-radio"
                      value={value}
                      onSelect={select}
                      key={value}
                    >
                      <div className="vds-radio-check" />
                      <span className="vds-radio-label">{label}</span>
                      {bitrateText ? (
                        <span className="vds-radio-hint">{bitrateText}</span>
                      ) : null}
                    </Menu.Radio>
                  ))}
                </Menu.RadioGroup>
              </Menu.Content>
            </Menu.Root> */}
          </Menu.Items>
        </Menu.Root>
      </Controls.Root>
    </div>
  );
}
function SubmenuButton({ label, hint, icon: Icon, disabled }) {
  return (
    <Menu.Button className="vds-menu-button" disabled={disabled}>
      {/* <Icon className="vds-menu-button-icon" /> */}
      <span className="vds-menu-button-label">{label}</span>
      <span className="vds-menu-button-hint">{hint}</span>
    </Menu.Button>
  );
}

export default VidStackPlayer;

// export default ShakaVideoPlayer;
