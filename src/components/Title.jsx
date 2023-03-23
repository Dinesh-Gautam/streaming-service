import { formatParagraph } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import FadeImageOnLoad from "./elements/FadeImageOnLoad";
import Separator from "./elements/separator";
import { LayoutGroup, motion } from "framer-motion";
import styles from "./View.module.scss";
import Image from "next/image";
import { getImageUrl } from "@/tmdbapi/tmdbApi";
import {
  ArrowLeft,
  ArrowRight,
  PlayArrowRounded,
  Star,
} from "@mui/icons-material";
import Link from "next/link";
import YoutubeVideoPlayer from "./videoPlayer/youtube/youtubeVideoPlayer";
import useYoutubePlayer from "./videoPlayer/youtube/hook/useYoutubePlayer";
import Select from "./elements/customSelect/CustomSelect";

const otherElementsAnimation = {
  initial: {
    opacity: 1,
    // pointerEvents: "all",
  },
  animate: {
    opacity: 0,
    pointerEvents: "none",
  },
};

const HeadingAnimation = {
  initial: {
    position: "relative",
    top: 0,
    left: 0,
  },
  animate: {
    position: "absolute",
    top: 0,
    left: 0,
  },
};

function TitleView({ result, layout_type, original }) {
  const [animating, setAnimating] = useState(true);
  const playerRef = useRef(null);
  const [playerState, setPlayerState] = useState({ playing: false });
  const [id, setId] = useState(result.id);
  const { ButtonsComponent, videosData } = useYoutubePlayer({
    playerRef,
    playerState,
    setPlayerState,
    setId,
    id,
    media_type: result.media_type,
  });

  console.log(result);
  const [hideAll, setHideAll] = useState(false);
  const [seasonSelect, setSeasonSelect] = useState(null);
  const [seasonInfo, setSeasonInfo] = useState(
    result.media_type === "tv" ? result.seasonInfo : null
  );

  const hideTimeOutRef = useRef(null);
  useEffect(() => {
    clearTimeout(hideTimeOutRef.current);
    if (!playerState.playing) return;
    console.log(playerState);
    hideTimeOutRef.current = setTimeout(() => {
      if (!playerState.playing) return;

      console.log("clearing timeout ref in useEffect");
      setHideAll(true);
    }, 3000);
  }, [playerState]);

  // useEffect(() => {
  //   console.log(result);
  //   if (!seasonInfo) {
  //     console.log(result.seasonInfo);
  //     setSeasonInfo(result.seasonInfo);
  //   }
  // }, []);

  useEffect(() => {
    if (result.media_type !== "tv") return;
    console.log("getting season info");
    if (seasonSelect) {
      (async () => {
        const si = await getDetails(result.id, result.media_type, {
          type: "season",
          season: seasonSelect.season_number,
        });
        setSeasonInfo(si);
      })();
    }
  }, [seasonSelect]);

  const episodeWrapperRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [rightButtonDisplay, setRightButtonDisplay] = useState(false);

  useEffect(() => {
    setRightButtonDisplay(
      episodeWrapperRef.current &&
        (scrollLeft <
          Math.floor(
            episodeWrapperRef.current?.scrollWidth -
              episodeWrapperRef.current?.clientWidth
          ) ||
          scrollLeft < 1) &&
        episodeWrapperRef.current.clientWidth !==
          episodeWrapperRef.current.scrollWidth
    );
  }, [episodeWrapperRef, scrollLeft, seasonInfo]);

  function rightButtonClick() {
    episodeWrapperRef.current.scrollLeft +=
      episodeWrapperRef.current.clientWidth / 1.2;
    setScrollLeft(
      Math.min(
        episodeWrapperRef.current.scrollLeft +
          episodeWrapperRef.current.clientWidth / 1.2,
        episodeWrapperRef.current.scrollWidth -
          episodeWrapperRef.current.clientWidth
      )
    );
  }

  function leftButtonClick() {
    episodeWrapperRef.current.scroll({
      left: Math.max(
        episodeWrapperRef.current.scrollLeft -
          episodeWrapperRef.current.clientWidth / 1.2,
        0
      ),
      behavior: "smooth",
    });
    setScrollLeft(
      Math.max(
        episodeWrapperRef.current.scrollLeft -
          episodeWrapperRef.current.clientWidth / 1.2,
        0
      )
    );
  }

  return (
    <motion.div
      layout
      onAnimationEnd={() => {
        setAnimating(false);
      }}
      layoutId={
        !layout_type
          ? ""
          : layout_type === "hover"
          ? layout_type
          : layout_type + result.id
      }
      className={styles.container}
    >
      <motion.div
        animate={
          hideAll
            ? otherElementsAnimation.animate
            : otherElementsAnimation.initial
        }
        style={{
          position: "relative",
          zIndex: 100000,
          backdropFilter: playerState.playing ? "blur(0px)" : "blur(64px)",
        }}
        className={styles.leftContainer}
      >
        <motion.div
          style={
            {
              // height: "10rem",
            }
          }
        >
          <motion.h1
            transition={{
              ease: "easeInOut",
              layout: { duration: 0.3, ease: "easeInOut" },
            }}
            animate={{
              scale: playerState.playing ? 0.5 : 1,
              // x: playerState.playing ? -50 : 0,
              // y: playerState.playing ? -50 : 0,
            }}
            style={{
              transformOrigin: "top left",
            }}
            // style={
            //   playerState.playing
            //     ? {
            //         position: "absolute",
            //         top: 0,
            //         left: 0,
            //         width: "46%",
            //         padding: "1rem",
            //         transformOrigin: "top left",
            //       }
            //     : {
            //         transformOrigin: "top left",
            //         position: "relative",
            //         width: "100%",
            //       }
            // }
          >
            {result.title ||
              result.name ||
              result.original_title ||
              result.original_name}
          </motion.h1>
        </motion.div>
        <motion.div
          animate={
            playerState.playing
              ? otherElementsAnimation.animate
              : otherElementsAnimation.initial
          }
        >
          <Separator
            gap={8}
            values={[
              result.media_type,
              original
                ? result.genres
                    .split(",")
                    .map((gen, index, { length }) =>
                      index + 1 == length ? gen + " " : gen + ", "
                    )
                    .join(" ")
                : result.genres
                    .map((gen, index, { length }) =>
                      index + 1 == length ? gen.name + " " : gen.name + ", "
                    )
                    .join(" "),
              isNaN(new Date(result?.first_air_date).getFullYear())
                ? ""
                : new Date(result?.first_air_date).getFullYear(),
            ]}
          />
          {!original && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginTop: "1rem",
              }}
            >
              <Star color="warning" />
              <Separator
                values={[
                  `${result?.vote_average.toFixed(1) || null} (${
                    result?.vote_count?.toLocaleString() || null
                  })`,
                  (result.number_of_episodes &&
                    result.number_of_episodes + "eps") ||
                    null,
                  result.episode_run_time &&
                    result.episode_run_time.join(" - ") + "min",
                  result.languages && result.languages.join(", "),
                  result.runtime && result.runtime + " mins",
                ]}
              />
            </div>
          )}
          <div>
            <p>{formatParagraph(result.overview || result.description)}</p>
          </div>
        </motion.div>
        <motion.div
          layout="position"
          style={
            playerState.playing
              ? {
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  // padding: "4rem",
                  margin: "4rem",
                  // width: "10rem",
                }
              : {
                  position: "relative",
                  // width: "10rem",
                }
          }
        >
          {original && (
            <Link href={"/movie" + "?id=" + result?.uid}>
              <button
              // onClick={
              // () =>
              // router.push(
              //   `api/videoStream?ih=${videoFileInfo.infoHash}&i=${videoFileInfo.videoFileIndex}`
              // )
              // }
              >
                <div
                  style={{
                    paddingLeft: "2rem",
                  }}
                >
                  Watch Now
                </div>
                <span>
                  <PlayArrowRounded fontSize="large" />
                </span>
              </button>
            </Link>
          )}
          <ButtonsComponent size="large" />

          {result.media_type === "tv" && seasonInfo && (
            <div className={styles.seasonContainer}>
              <div className={styles.seasonSelectorContainer}>
                {/* <Select
                  onChange={setSeasonSelect}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    backdropFilter: "blur(12px)",
                    colors: {
                      ...theme.colors,
                      primary25: " rgba(255, 255, 255, 0.2)",
                      primary: "rgba(255,255,255,0.8)",
                      primary50: "rgba(255,255,255,0.2)",
                    },
                  })}
                  styles={customStyles}
                  defaultValue={seasonArray[0]}
                  options={seasonArray}
                /> */}
                <Select
                  options={[
                    { label: "value1", value: "value1" },
                    { label: "value2", value: "value2" },
                    { label: "value3", value: "value3" },
                  ]}
                />
                {/* <select name="season_select" id="">
                {Array.from(
                  { length: result.number_of_seasons },
                  (_, index) => (
                    <option key={index} value={index + 1}>
                      {"Season " + (index + 1)}
                    </option>
                  )
                )}
              </select> */}
              </div>
              <div className={styles.tvContainer}>
                <button
                  style={{
                    display: scrollLeft > 1 ? "flex" : "none",
                  }}
                  onClick={leftButtonClick}
                  className={styles.leftButton}
                >
                  <ArrowLeft fontSize="large" />
                </button>
                <button
                  style={{
                    display: rightButtonDisplay ? "flex" : "none",
                  }}
                  onClick={rightButtonClick}
                  className={styles.rightButton}
                >
                  <ArrowRight fontSize="large" />
                </button>
                <div
                  ref={(el) => (episodeWrapperRef.current = el)}
                  className={styles.episodesContainer}
                >
                  <div className={styles.episodeWrapper}>
                    {seasonInfo.episodes.map(
                      (epi, index) =>
                        epi.still_path !== null && (
                          <div
                            onClick={() =>
                              findSeriesOnClick(
                                result.title ||
                                  result.name ||
                                  result.original_title ||
                                  result.original_name,
                                epi.season_number,
                                epi.episode_number
                              )
                            }
                            className={styles.episode}
                            key={epi.id}
                          >
                            <span className={styles.episodeNumber}>
                              {(index + 1 < 10 ? "0" : "") + (index + 1)}
                            </span>
                            <span className={styles.episodeName}>
                              {epi.name}
                            </span>
                            <FadeImageOnLoad
                              loadingBackground
                              imageSrc={epi.still_path}
                              duration={0.5}
                              attr={{
                                imageContainer: {
                                  className: styles.episodeImageContainer,
                                },
                                image: {
                                  objectFit: "cover",
                                  width: 228,
                                  height: 148,
                                },
                              }}
                            />
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
      {!animating && (
        <motion.div
          style={{
            pointerEvents: "none",
          }}
          animate={
            playerState.playing
              ? otherElementsAnimation.animate
              : otherElementsAnimation.initial
          }
        >
          <FadeImageOnLoad
            imageSrc={result.poster_path}
            original={original}
            // imageSrc={result.backdrop_path || result.poster_path}
            duration={2}
            attr={{
              imageContainer: {
                className: styles.backdropImage,
              },
              image: {
                layout: "fill",
              },
            }}
          />
        </motion.div>
      )}
      <motion.div
        style={{
          position: "absolute",
          height: "100vh",
          width: "100vw",
          left: 0,
          top: 0,
        }}
        onMouseMove={() => {
          // if (!hideAll) return;
          clearTimeout(hideTimeOutRef.current);

          if (!playerState.playing) return;
          console.log("hovering");
          setHideAll(false);
          hideTimeOutRef.current = setTimeout(() => {
            if (!playerState.playing) return;

            console.log("clearing timeout ref in hover");
            setHideAll(true);
          }, 3000);
        }}
      >
        <motion.div
          className={styles.backdropImage + " " + styles.backdropImageBlurred}
        >
          {videosData &&
            videosData.length > 0 &&
            videosData.find((e) => e.id === id) && (
              <YoutubeVideoPlayer
                playerRef={playerRef}
                playerState={playerState}
                setPlayerState={setPlayerState}
                videoId={videosData.find((e) => e.id === id)?.videos[0]?.key}
              />
            )}
          {!layout_type ? (
            <FadeImageOnLoad
              imageSrc={result.backdrop_path}
              original={original}
              // imageSrc={result.backdrop_path || result.poster_path}
              duration={2}
              attr={{
                imageContainer: { className: styles.backdropImage },
                image: {
                  layout: "fill",
                },
              }}
            />
          ) : (
            <Image
              src={getImageUrl(result.backdrop_path, { original })}
              alt="image"
              fill
            />
          )}
        </motion.div>
      </motion.div>
      {/* <FadeImageOnLoad
        imageSrc={result.backdrop_path || result.poster_path}
        duration={2}
        attr={{
          imageContainer: {
            className: styles.backdropImage + " " + styles.backdropImageBlurred,
          },
          image: {
            layout: "fill",
            objectFit: "cover",
          },
        }}
      /> */}
    </motion.div>
  );
}

export default TitleView;
