import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getImageUrl } from "../../tmdbapi/tmdbApi";
import styles from "./banner.module.scss";
import FadeImageOnLoad from "../elements/FadeImageOnLoad";
import Link from "next/link";
import { red } from "@mui/material/colors";
import {
  Pause,
  PauseCircleFilled,
  PlayArrow,
  VolumeMuteRounded,
  VolumeOff,
  VolumeUpRounded,
} from "@mui/icons-material";
import YoutubeVideoPlayer from "../videoPlayer/youtube/youtubeVideoPlayer";

const PopularMoviesBanner = ({ popularMovies }) => {
  const [prevIndex, setPrevIndex] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(1);

  const [nextIndex, setNextIndex] = useState(2);

  const [disable, setDisable] = useState(false);
  const disableTimeoutRef = useRef(null);

  const [videosData, setVideosData] = useState([]);
  const playerRef = useRef(null);
  const [playerState, setPlayerState] = useState({ playing: false });
  useEffect(() => {
    setPlayerState((prev) => ({ ...prev, playing: false }));
    const id = popularMovies[currentIndex].id;
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

    console.log(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    console.log(videosData);
  }, [videosData]);

  function buttonClick() {
    setDisable(true);
    clearTimeout(disableTimeoutRef.current);

    if (!disableTimeoutRef.current) {
      console.log("clicking", disableTimeoutRef.current);

      disableTimeoutRef.current = setTimeout(() => {
        setDisable(false);
        console.log("removing", disableTimeoutRef.current);
        disableTimeoutRef.current = null;
      }, 800);
    }
  }

  function setIndexNext(prev) {
    const index = prev + 1;
    if (index > popularMovies.length - 1) {
      return 0;
    }
    return index;
  }
  function setIndexPrev(prev) {
    const index = prev - 1;
    if (index < 0) {
      return popularMovies.length - 1;
    }
    return index;
  }

  const handleNext = () => {
    buttonClick();
    setNextIndex(setIndexNext);
    setCurrentIndex(setIndexNext);
    setPrevIndex(setIndexNext);
  };

  const handlePrev = () => {
    buttonClick();
    setNextIndex(setIndexPrev);
    setCurrentIndex(setIndexPrev);
    setPrevIndex(setIndexPrev);
  };

  return (
    <>
      <div className={styles.bannerContainer}>
        {popularMovies.map((movie, index) => {
          return (
            <div
              key={index}
              className={
                styles.banner +
                " " +
                (index == nextIndex
                  ? styles.right
                  : index === prevIndex
                  ? styles.left
                  : index === currentIndex
                  ? styles.middle
                  : index === nextIndex + 1 || index < prevIndex - 1
                  ? styles.extremeRight
                  : index > nextIndex + 1 || index === prevIndex - 1
                  ? styles.extremeLeft
                  : "")
              }
            >
              <Link
                href={
                  "/title?id=" + movie.id + "&type=" + "movie" + "&t=banner"
                }
              >
                <FadeImageOnLoad
                  loadingBackground
                  imageSrc={
                    index == nextIndex ||
                    index === prevIndex ||
                    index === currentIndex ||
                    index === prevIndex - 1 ||
                    index === nextIndex + 1 ||
                    index === 0 ||
                    index === popularMovies.length - 1
                      ? popularMovies[index].backdrop_path
                      : ""
                  }
                  ambientMode
                  positionAbsolute
                  ambientOptions={{ blur: 128, scale: 1 }}
                  attr={{
                    imageContainer: {
                      layoutId: "banner" + movie.id,
                      className: styles.bannerImageContainer,
                    },
                    image: {
                      height: 1300 / 2,
                      width: 1300,
                    },
                  }}
                ></FadeImageOnLoad>
              </Link>
              <>
                <div
                  className={
                    styles.bottom +
                    " " +
                    (currentIndex === index ? styles.visible : "")
                  }
                >
                  <h1>{movie.title || ""}</h1>
                  <div className={styles.videoControls}>
                    {playerState.playing && (
                      <button
                        onClick={() => {
                          const muteState = playerRef.current.isMuted();
                          muteState
                            ? playerRef.current.unMute()
                            : playerRef.current.mute();
                          setPlayerState((prev) => ({
                            ...prev,
                            muted: !muteState,
                          }));
                        }}
                      >
                        {playerState.muted ? (
                          <VolumeOff />
                        ) : (
                          <VolumeUpRounded />
                        )}
                      </button>
                    )}
                    {!!videosData.find((e) => e.id === movie.id)?.videos
                      .length && (
                      <button
                        onClick={() => {
                          if (!playerRef.current) return;
                          console.log(playerRef.current);
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
                        disabled={currentIndex !== index}
                      >
                        {playerState.playing ? <Pause /> : <PlayArrow />}
                      </button>
                    )}
                  </div>
                </div>

                {index === currentIndex &&
                  videosData.length > 0 &&
                  videosData.find((e) => e.id === movie.id) && (
                    <YoutubeVideoPlayer
                      roundedBorder
                      playerRef={playerRef}
                      playerState={playerState}
                      setPlayerState={setPlayerState}
                      videoId={
                        videosData.find((e) => e.id === movie.id)?.videos[0]
                          ?.key
                      }
                    />
                  )}
              </>
            </div>
          );
        })}
        {/* <div className={styles.banner + " " + styles.left}> */}
        {/* <Image
          src={getImageUrl(popularMovies[prevIndex].backdrop_path)}
          alt={popularMovies[prevIndex].title}
          width={200}
          height={200}
        /> */}
        {/* <h3>{popularMovies[prevIndex].title}</h3> */}
        {/* </div> */}
        {/* <div className={styles.banner + " " + styles.middle}> */}
        {/* <Image
          src={getImageUrl(popularMovies[currentIndex].backdrop_path)}
          alt={popularMovies[currentIndex].title}
          width={500}
          height={300}
        /> */}
        {/* <h3>{popularMovies[currentIndex].title}</h3> */}
        {/* </div> */}
        {/* <div className={styles.banner + " " + styles.right}> */}
        {/* <Image
          src={getImageUrl(popularMovies[nextIndex].backdrop_path)}
          alt={popularMovies[nextIndex].title}
          width={200}
          height={200}
        /> */}
        {/* <h3>{popularMovies[nextIndex].title}</h3> */}
        {/* </div> */}
        <button
          disabled={disable}
          className={styles.leftButton}
          onClick={handlePrev}
        >
          Previous
        </button>
        <button
          disabled={disable}
          className={styles.rightButton}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default PopularMoviesBanner;
