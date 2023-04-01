import { FormatParagraph } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import FadeImageOnLoad from "./elements/FadeImageOnLoad";
import Separator from "./elements/separator";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import styles from "./View.module.scss";
import Image from "next/image";
import { getDetails, getImageUrl } from "@/tmdbapi/tmdbApi";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Close,
//   PlayArrowRounded,
//   Star,
// } from "@mui/icons-material";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowRight from "@mui/icons-material/ArrowRight";
import Close from "@mui/icons-material/Close";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Star from "@mui/icons-material/Star";
import Link from "next/link";
import YoutubeVideoPlayer from "./videoPlayer/youtube/youtubeVideoPlayer";
import useYoutubePlayer from "./videoPlayer/youtube/hook/useYoutubePlayer";
import Select from "./elements/customSelect/CustomSelect";
import { useData } from "../context/stateContext";
import { checkIfStringIsValidUrl } from "../utils";

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

const MoreInfo = ({ result, id, media_type }) => {
  const filteredResults = Object.entries(result).filter(
    ([key, value]) =>
      (value || value?.length) &&
      (key === "first_air_date" ||
        key === "release_date" ||
        key === "original_name" ||
        key === "languages" ||
        key === "original_title" ||
        key === "original_language" ||
        key === "production_countries" ||
        key === "spoken_languages" ||
        key === "status" ||
        key === "tagline" ||
        key === "seasons" ||
        key === "homepage" ||
        key === "revenue")
  );
  console.log(Object.entries(result));
  console.log(filteredResults);
  const { moreInfoData, setMoreInfoData } = useData();
  const [moreInfo, setMoreInfo] = useState(null);
  useEffect(() => {
    const alreadyExists = moreInfoData.find(
      (e) => e.id === id && e.media_type === media_type
    );

    if (alreadyExists) {
      setMoreInfo(alreadyExists.data);

      return;
    }

    async function fetchMoreInfo() {
      console.log("fetching more Info");
      const data = await fetch(
        "/api/tmdb/more?id=" +
          id +
          "&media_type=" +
          media_type +
          "&r=" +
          "reviews,watch_providers"
      ).then((e) => e.json());
      if (data.success) {
        setMoreInfo(data.data);
        console.log(data);
        setMoreInfoData((prev) => [
          ...prev,
          { id, media_type, data: data.data },
        ]);
      } else {
        alert("some error occured");
      }
    }

    fetchMoreInfo();
  }, []);

  useEffect(() => {
    console.log(moreInfo);
  }, [moreInfo]);

  const topReview = moreInfo?.reviews?.results[0];
  return (
    <div className={styles.moreInfoWrapper}>
      <div className={styles.linksContainer}>
        <h2>Links</h2>
        <div className={styles.linksGroup}>
          {moreInfo?.watch_providers.results.IN && (
            <div>
              {moreInfo &&
                moreInfo.watch_providers.results.IN &&
                moreInfo.watch_providers.results.IN.flatrate.map((provider) => (
                  <Link
                    target={"_blank"}
                    key={provider.id}
                    href={moreInfo.watch_providers.results.IN.link}
                  >
                    <div className={styles.linkLogo}>
                      <Image
                        src={getImageUrl(
                          moreInfo.watch_providers.results.IN.flatrate[0]
                            .logo_path
                        )}
                        alt={
                          moreInfo.watch_providers.results.IN.flatrate[0]
                            .provider_name
                        }
                        height={50}
                        width={50}
                      />
                    </div>
                  </Link>
                ))}
            </div>
          )}
          <div>imdb</div>
        </div>
      </div>
      <div className={!moreInfo ? styles.moreInfoLoading : ""}>
        <h2>User Reviews:</h2>
        <div className={styles.reviewContainer}>
          <div className={styles.reviewHeader}>
            <div className={styles.avatar}>
              {topReview && topReview.author_details.avatar_path && (
                <Image
                  src={
                    topReview.author_details.avatar_path.startsWith("/https")
                      ? topReview.author_details.avatar_path.replace("/", "")
                      : getImageUrl(topReview.author_details.avatar_path)
                  }
                  alt="user_pic"
                  width={40}
                  height={40}
                />
              )}
            </div>
            <div className={styles.authorInfo}>
              <h4>{topReview && topReview.author}</h4>
              <span>{topReview && topReview.author_details.username}</span>
            </div>
          </div>
          <div className={styles.reviewContent}>
            {topReview && <FormatParagraph para={topReview.content} />}
          </div>
        </div>
      </div>
      <div>
        <h2>Details</h2>
        <div className={styles.detailsContainer}>
          {filteredResults.map(([key, value], index) => {
            return (
              <div className={styles.item} key={index}>
                <span className={styles.key}>{key.replaceAll("_", " ")}: </span>
                <span className={styles.value}>
                  {typeof value === "object" ? (
                    <>
                      {value
                        ?.map((e) => e.english_name || e.name || e)
                        .join(", ")}
                      <span style={{ opacity: 0.5 }}> ({value.length}) </span>
                    </>
                  ) : (
                    checkIfStringIsValidUrl(value)
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function TitleView({ result, layout_type, original, signedIn }) {
  const [animating, setAnimating] = useState(true);
  const playerRef = useRef(null);
  const [playerState, setPlayerState] = useState({ playing: false });
  const [id, setId] = useState(result.id);
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);
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
        // const si = await getDetails(result.id, result.media_type, {
        //   type: "season",
        //   season: seasonSelect.season_number,
        // });
        // setSeasonInfo(si);

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
      onAnimationEnd={() => {
        console.log("animation complete");
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
          {!moreInfoOpen && (
            <motion.div
              layout
              layoutId="moreInfoLayout"
              onClick={() => setMoreInfoOpen(true)}
              className={styles.moreInfoContainer}
            >
              <div>
                {!original && (
                  <div
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
                  </div>
                )}
                <button>
                  More info <ArrowDownward />
                </button>
              </div>

              <FormatParagraph
                hideShowClickHere
                para={result.overview || result.description}
              />
            </motion.div>
          )}
        </motion.div>
        <motion.div>
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

          {result.media_type === "tv" && seasonInfo && (
            <motion.div
              animate={
                playerState.playing
                  ? otherElementsAnimation.animate
                  : otherElementsAnimation.initial
              }
              className={styles.seasonContainer}
            >
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
            </motion.div>
          )}

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
            <ButtonsComponent size="large" />
          </motion.div>
        </motion.div>
      </motion.div>

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
                {!original && (
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
          {!animating &&
            videosData &&
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
