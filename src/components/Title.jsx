import { FormatParagraph } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import FadeImageOnLoad from "./elements/FadeImageOnLoad";
import Separator from "./elements/separator";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./View.module.scss";
import Image from "next/image";
import { getImageUrl } from "@/tmdbapi/tmdbApi";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowRight from "@mui/icons-material/ArrowRight";
import Close from "@mui/icons-material/Close";
import Star from "@mui/icons-material/Star";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Link from "next/link";
import YoutubeVideoPlayer from "./videoPlayer/youtube/youtubeVideoPlayer";
import Select from "./elements/customSelect/CustomSelect";
import MoreInfo from "./title/MoreInfo";
import YoutubeControlButtons from "./videoPlayer/youtube/youtubePlayerControlsButtons";
import { useYoutubePlayer } from "./videoPlayer/youtube/youtubePlayerContext";

const otherElementsAnimation = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 0,
    pointerEvents: "none",
  },
};

function TitleView({ result, layout_type }) {
  const [animating, setAnimating] = useState(true);
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);
  const { playerState } = useYoutubePlayer();
  const { hideAll, onMouseMove } = useHideUntilMouseInactivity();
  return (
    <motion.div
      onAnimationEnd={() => {
        setAnimating(false);
      }}
      layout
      layoutId={
        !layout_type
          ? ""
          : layout_type === "hover"
          ? layout_type
          : layout_type + result.id
      }
      className={styles.container}
    >
      <HideUntilMouseInactive
        hideAll={hideAll}
        style={{
          position: "relative",
          zIndex: 100000,
          backdropFilter: playerState.playing ? "blur(0px)" : "blur(64px)",
        }}
        className={styles.leftContainer}
      >
        <Title result={result} />
        <HideWhenPlayerIsPlaying>
          <SeparatedInfo result={result} />
        </HideWhenPlayerIsPlaying>
        <HideWhenPlayerIsPlaying>
          <ClickableLessInfo
            result={result}
            moreInfoOpen={moreInfoOpen}
            setMoreInfoOpen={setMoreInfoOpen}
          />
        </HideWhenPlayerIsPlaying>
        <div>
          {result.media_type === "tv" && <TvSeasonsDrawer result={result} />}
          <Buttons result={result} />
        </div>
      </HideUntilMouseInactive>

      <OpenedMoreInfo
        result={result}
        moreInfoOpen={moreInfoOpen}
        setMoreInfoOpen={setMoreInfoOpen}
      />

      {!animating && <Poster result={result} />}

      <Backdrop
        result={result}
        onMouseMove={onMouseMove}
        layout_type={layout_type}
        animating={animating}
      />
    </motion.div>
  );
}

function Title({ result }) {
  const { playerState } = useYoutubePlayer();
  return (
    <motion.div>
      <motion.h1
        transition={{
          ease: "easeInOut",
          layout: { duration: 0.3, ease: "easeInOut" },
        }}
        animate={{
          scale: playerState.playing ? 0.5 : 1,
        }}
        style={{
          transformOrigin: "top left",
        }}
      >
        {result.title ||
          result.name ||
          result.original_title ||
          result.original_name}
      </motion.h1>
    </motion.div>
  );
}

function SeparatedInfo({ result }) {
  return (
    <Separator
      gap={8}
      values={[
        result.media_type,
        result.original
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
  );
}

function ClickableLessInfo({ result, moreInfoOpen, setMoreInfoOpen }) {
  return (
    !moreInfoOpen && (
      <motion.div
        layout
        layoutId="moreInfoLayout"
        onClick={() => !result.original && setMoreInfoOpen(true)}
        className={styles.moreInfoContainer}
      >
        {!result.original && (
          <div style={{ flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Star color="warning" />
              <Separator
                gap={8}
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

            <button>
              More info <ArrowDownward />
            </button>
          </div>
        )}

        <FormatParagraph
          hideShowClickHere={!result.original}
          para={result.overview || result.description}
        />
      </motion.div>
    )
  );
}

function OpenedMoreInfo({ result, moreInfoOpen, setMoreInfoOpen }) {
  return (
    <AnimatePresence>
      {moreInfoOpen && (
        <motion.div
          initial={{
            background: "rgba(0,0,0,0.0)",
            backdropFilter: "blur(0px)",
          }}
          animate={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(64px)",
          }}
          exit={{
            background: "rgba(0,0,0,0.0)",
            backdropFilter: "blur(0px)",
          }}
          className={moreInfoOpen ? styles.moreInfoOverlay : ""}
        >
          <motion.div
            layout
            layoutId="moreInfoLayout"
            className={styles.moreInfoContainer}
          >
            <div>
              {!result.original && (
                <motion.div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    // marginTop: "1rem",
                  }}
                >
                  <Star color="warning" />
                  <Separator
                    gap={8}
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
                </motion.div>
              )}
              <button onClick={() => setMoreInfoOpen(false)}>
                <Close />
              </button>
            </div>

            <FormatParagraph para={result.overview || result.description} />
            <MoreInfo
              result={result}
              id={result.id}
              media_type={result.media_type}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Buttons({ result }) {
  const { playerState } = useYoutubePlayer();
  return (
    <>
      {result.original && (
        <Link href={"/movie" + "?id=" + result?.uid}>
          <button>
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

      <motion.div
        layout="position"
        style={
          playerState.playing
            ? {
                position: "absolute",
                bottom: 0,
                left: 0,

                margin: "4rem",
              }
            : {
                position: "relative",
              }
        }
      >
        <WatchNowButton result={result} />
        {!result.original && <YoutubeControlButtons size="large" />}
      </motion.div>
    </>
  );
}

function Poster({ result }) {
  return (
    <HideWhenPlayerIsPlaying
      style={{
        pointerEvents: "none",
      }}
    >
      <FadeImageOnLoad
        imageSrc={result.poster_path}
        original={result.original}
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
    </HideWhenPlayerIsPlaying>
  );
}

function Backdrop({ result, onMouseMove, layout_type, animating }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        height: "100vh",
        width: "100vw",
        left: 0,
        top: 0,
      }}
      onMouseMove={onMouseMove}
    >
      <motion.div
        className={styles.backdropImage + " " + styles.backdropImageBlurred}
      >
        {!animating && <YoutubeVideoPlayer />}
        {!layout_type ? (
          <FadeImageOnLoad
            imageSrc={result.backdrop_path}
            original={result.original}
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
            src={getImageUrl(result.backdrop_path, {
              original: result.original,
            })}
            alt="image"
            fill
          />
        )}
      </motion.div>
    </motion.div>
  );
}

const useHideUntilMouseInactivity = () => {
  const [hideAll, setHideAll] = useState(false);
  const hideTimeOutRef = useRef(null);
  const { playerState } = useYoutubePlayer();
  function onMouseMove() {
    // if (!hideAll) return;
    clearTimeout(hideTimeOutRef.current);

    if (!playerState.playing) return;
    setHideAll(false);
    hideTimeOutRef.current = setTimeout(() => {
      if (!playerState.playing) return;

      console.log("clearing timeout ref in hover");
      setHideAll(true);
    }, 3000);
  }
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
  return { hideAll, onMouseMove };
};

function WatchNowButton({ result }) {
  return (
    !result.original &&
    result.media_type === "movie" && (
      <Link
        target="_blank"
        href={
          "/title/watch/?media_type=" + result?.media_type + "&id=" + result?.id
        }
      >
        <button
          style={{
            marginBottom: "1rem",
          }}
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
    )
  );
}

function HideWhenPlayerIsPlaying({ children, ...props }) {
  const { playerState } = useYoutubePlayer();
  return (
    <motion.div
      {...props}
      animate={
        playerState.playing
          ? otherElementsAnimation.animate
          : otherElementsAnimation.initial
      }
    >
      {children}
    </motion.div>
  );
}

function HideUntilMouseInactive({ hideAll, children, ...props }) {
  return (
    <motion.div
      {...props}
      animate={
        hideAll
          ? otherElementsAnimation.animate
          : otherElementsAnimation.initial
      }
    >
      {children}
    </motion.div>
  );
}

function TvSeasonsDrawer({ result }) {
  const [seasonSelect, setSeasonSelect] = useState(null);
  const [seasonInfo, setSeasonInfo] = useState(
    result.media_type === "tv" ? result.seasonInfo : null
  );
  const [rightButtonDisplay, setRightButtonDisplay] = useState(false);
  useEffect(() => {
    if (result.media_type !== "tv") return;
    console.log("getting season info");
    if (seasonSelect) {
      (async () => {
        const si = await fetch(
          "/api/tmdb/season?id=" +
            result.id +
            "&media_type=" +
            result.media_type +
            "&season=" +
            seasonSelect.season_number
        ).then((e) => e.json());
        setSeasonInfo(si);
      })();
    }
  }, [seasonSelect]);

  const episodeWrapperRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);

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
    seasonInfo && (
      <HideWhenPlayerIsPlaying className={styles.seasonContainer}>
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
            onChange={(option) => {
              setSeasonSelect({ season_number: option.value });
            }}
            defaultValue={1}
            options={result.seasons.map((e) => ({
              label: e.name,
              value: e.season_number,
            }))}
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
                    <Link
                      key={epi.id}
                      target="_blank"
                      href={
                        "/title/watch/?media_type=" +
                        result?.media_type +
                        "&id=" +
                        result?.id +
                        "&s=" +
                        epi.season_number +
                        "&e=" +
                        epi.episode_number
                      }
                    >
                      <div className={styles.episode}>
                        <span className={styles.episodeNumber}>
                          {(index + 1 < 10 ? "0" : "") + (index + 1)}
                        </span>
                        <span className={styles.episodeName}>{epi.name}</span>
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
                    </Link>
                  )
              )}
            </div>
          </div>
        </div>
      </HideWhenPlayerIsPlaying>
    )
  );
}

export default TitleView;
