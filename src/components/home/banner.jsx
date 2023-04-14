import React, { useEffect, useRef, useState } from "react";
import styles from "./banner.module.scss";
import FadeImageOnLoad from "../elements/FadeImageOnLoad";
import Link from "next/link";
import YoutubeVideoPlayer from "../videoPlayer/youtube/youtubeVideoPlayer";
import YoutubeControlButtons from "../videoPlayer/youtube/youtubePlayerControlsButtons";
import YoutubeVideoPlayerProvider from "../videoPlayer/youtube/youtubePlayerContext";

const PopularMoviesBanner = ({ popularMovies }) => {
  const [prevIndex, setPrevIndex] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(1);

  const [nextIndex, setNextIndex] = useState(2);

  const [disable, setDisable] = useState(false);
  const [animating, setAnimating] = useState(false);
  const disableTimeoutRef = useRef(null);

  function buttonClick() {
    setDisable(true);
    setAnimating(true);
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

  useEffect(() => {
    if (animating) {
      setAnimating(false);
    }
  }, [currentIndex]);

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
    <YoutubeVideoPlayerProvider
      id={popularMovies[currentIndex]?.id}
      media_type={popularMovies[currentIndex]?.media_type || "movie"}
    >
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
                  ambientOptions={{
                    opacity: 0.5,
                    saturation: 1.4,
                    brightness: 2,
                    blur: 124,
                    scale: 1,
                  }}
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
              {!animating && (
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
                      {<YoutubeControlButtons />}
                    </div>
                  </div>

                  {index === currentIndex && (
                    <YoutubeVideoPlayer roundedBorder />
                  )}
                </>
              )}
            </div>
          );
        })}

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
    </YoutubeVideoPlayerProvider>
  );
};

export default PopularMoviesBanner;
