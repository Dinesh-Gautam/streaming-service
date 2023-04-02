import Separator from "@/components/elements/separator";
import useYoutubePlayer from "@/components/videoPlayer/youtube/hook/useYoutubePlayer";
import YoutubeVideoPlayer from "@/components/videoPlayer/youtube/youtubeVideoPlayer";
import { getImageUrl } from "@/tmdbapi/tmdbApi";
import { PlayArrow, Star, VolumeOff } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Slider from "./Index";
import styles from "./slider.module.scss";
function HomePageSliders(props) {
  const [hoverCardPosition, setHoverCardPosition] = useState({
    type: "popularMovies",
    x: 0,
    y: 0,
  });
  const [hoverCardActive, setHoverCardActive] = useState(false);
  const [inContainer, setInContainer] = useState(false);
  const timeOutRef = useRef(null);
  const clearingInterval = useRef(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const playerRef = useRef(null);
  const [playerState, setPlayerState] = useState({ playing: false });
  const [animating, setAnimating] = useState(true);
  const [id, setId] = useState(null);
  const { ButtonsComponent, videosData } = useYoutubePlayer({
    playerRef,
    playerState,
    setPlayerState,
    setId,
    id,
    media_type: hoverCardPosition.type
      ? props[hoverCardPosition.type].results[hoverCardPosition.index]
          ?.media_type
      : props.popularMovies.results[hoverCardPosition.index]?.media_type,
  });
  useEffect(() => {
    const id = hoverCardPosition.type
      ? props[hoverCardPosition.type].results[hoverCardPosition.index]?.id
      : props.popularMovies.results[hoverCardPosition.index]?.id;
    setId(id);

    console.log(hoverCardPosition);
  }, [hoverCardPosition]);
  console.log(props);
  async function clearHover() {
    if (timeOutRef.current) {
      setHoverCardActive(false);
      setHoverCardPosition({});
      console.log(timeOutRef.current);
      clearTimeout(timeOutRef.current);
      timeOutRef.current = null;
      setInContainer(false);
      setAnimating(false);
    }
  }
  // console.log(props.popularMovies);

  return (
    <>
      <div
        onMouseLeave={() => {
          if (!timeOutRef.current) return;
          if (!inContainer) {
            clearHover();
          }
        }}
        onMouseMove={(e) => {
          if (e.target.id === "imageContainer") {
            if (
              e.target.dataset.index !== hoverCardPosition.index &&
              e.target.dataset.middle === "true" &&
              !isScrolling
            ) {
              // setAnimating(false);
              setHoverCardActive(false);
              setAnimating(true);
              clearTimeout(timeOutRef.current);
              timeOutRef.current = setTimeout(() => {
                // if (!animating) {

                console.log("imageContainer");
                const rect = e.target.getBoundingClientRect();
                setHoverCardPosition({
                  x: rect.left + window.scrollX,
                  y: rect.top + window.scrollY,
                  height: rect.height,
                  width: rect.width,
                  original: e.target.dataset.original,
                  index: e.target.dataset.index,
                  type: e.target.dataset.type,
                });
                setHoverCardActive(true);
                setInContainer(true);
                // setAnimating(true);
                // }
              }, 300);
            }
          } else {
            if (timeOutRef.current && !clearingInterval.current) {
              clearHover();
            }
          }
        }}
      >
        {props.originalMovies && props.originalMovies.length && (
          <Slider
            setIsScrolling={setIsScrolling}
            title="Original Movies"
            data={props.originalMovies}
          />
        )}
        <Slider
          setIsScrolling={setIsScrolling}
          title="Trending Movies"
          data={props.trendingMovies.results}
          type={"trendingMovies"}
        />
        <Slider
          setIsScrolling={setIsScrolling}
          title="Now Playing"
          data={props.nowPlaying.results}
          type={"nowPlaying"}
        />

        <Slider
          setIsScrolling={setIsScrolling}
          title="Trending Tv Shows"
          data={props.trendingTv.results}
          type={"trendingTv"}
        />
        <Slider
          setIsScrolling={setIsScrolling}
          title="Top 10"
          data={props.popularMovies.results}
          type={"popularMovies"}
        />
      </div>
      <AnimatePresence>
        {hoverCardActive && (
          <motion.div
            style={{
              left: hoverCardPosition.x,
              top: hoverCardPosition.y,
              minHeight: hoverCardPosition.height,
              width: hoverCardPosition.width,
            }}
            onHoverEnd={(e) => {
              // setHoverCardActive(false);
              // setAnimating(true);
              if (!timeOutRef.current) return;

              console.log(timeOutRef.current);
              clearHover();
            }}
            onHoverStart={(e) => {
              console.log("mouse entered");
              // if()
              // clearTimeout(hoverEndTimeOutRef.current);
              // setInContainer(true);
            }}
            initial={{
              transform: "perspective(200px) translate3d(0%, 0%, 0px)",
            }}
            animate={{
              transform: `perspective(200px) translate3d(${
                100 > hoverCardPosition.x
                  ? "10"
                  : hoverCardPosition.x >
                    innerWidth - hoverCardPosition.width - 100
                  ? -10
                  : "0"
              }% , -20%, 50px)`,

              duration: 1,
              type: "ease",
            }}
            exit={{ transform: "perspective(200px) translate3d(0%, 0%, 0px)" }}
            transition={{
              type: "ease",
              ease: "easeInOut",
            }}
            onAnimationComplete={() => {
              // setAnimating(false);
              setAnimating(false);
            }}
            onAnimationStart={() => {}}
            className={styles.hoverCard}
          >
            <motion.div className={styles.hoverCardWrapper}>
              <Link
                href={
                  // "/movie" + "?id=" + props.originalMovies[hoverCardPosition.index]?.uid
                  "/title?id=" +
                  (hoverCardPosition.original
                    ? props.originalMovies[hoverCardPosition.index].uid
                    : props[hoverCardPosition.type].results[
                        hoverCardPosition.index
                      ].id) +
                  "&type=" +
                  (props[hoverCardPosition.type]?.results[
                    hoverCardPosition.index
                  ]?.media_type || "movie") +
                  "&t=hover" +
                  "&original=" +
                  (hoverCardPosition.original === "true" ? "true" : "false")
                }
              >
                <motion.div
                  layoutId={"hover"}
                  className={styles.imageContainer}
                >
                  {!hoverCardPosition.original &&
                    !animating &&
                    videosData.length > 0 &&
                    videosData.find((e) => e.id === id) && (
                      <YoutubeVideoPlayer
                        playerRef={playerRef}
                        playerState={playerState}
                        setPlayerState={setPlayerState}
                        videoId={
                          videosData.find((e) => e.id === id)?.videos[0]?.key
                        }
                      />
                    )}
                  <Image
                    src={
                      hoverCardPosition.original
                        ? "/api/static" +
                            props.originalMovies[
                              hoverCardPosition.index
                            ]?.backdrop_path.replace("uploads\\", "") || ""
                        : getImageUrl(
                            props[hoverCardPosition.type].results[
                              hoverCardPosition.index
                            ]?.backdrop_path || ""
                          )
                    }
                    //   ambientMode
                    //   positionAbsolute
                    //   ambientOptions={{ blur: 128, scale: 1 }}
                    style={{
                      position: "relative",
                      zIndex: 100,
                    }}
                    alt={"img"}
                    objectFit={"cover"}
                    height={1300 / 2}
                    width={1300}
                  />
                </motion.div>
              </Link>
              <motion.div className={styles.hoverCardInfo}>
                <motion.div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h1
                      style={{
                        width: "60%",
                      }}
                    >
                      {hoverCardPosition.original
                        ? props.originalMovies[hoverCardPosition.index]
                            ?.title || ""
                        : props[hoverCardPosition.type].results[
                            hoverCardPosition.index
                          ]?.title ||
                          props[hoverCardPosition.type].results[
                            hoverCardPosition.index
                          ]?.name}
                    </h1>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                      }}
                    >
                      {!hoverCardPosition.original && <ButtonsComponent />}
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    {/* {hoverCardPosition.original
                        ? props.originalMovies[hoverCardPosition.indx]?.description ||
                          ""
                        : props.popularMovies.results[
                            hoverCardPosition.index
                          ]?.overview
                            ?.split(" ")
                            .splice(0, 10)
                            .join(" ") || ""} */}
                    {hoverCardPosition.original && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Separator
                          values={[
                            new Date(
                              props.originalMovies[
                                hoverCardPosition.index
                              ]?.first_air_date
                            ).getFullYear(),
                          ]}
                        />
                      </div>
                    )}
                    {!hoverCardPosition.original && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Star color="warning" fontSize="small" />
                        <Separator
                          values={[
                            `${
                              props[hoverCardPosition.type].results[
                                hoverCardPosition.index
                              ]?.vote_average.toFixed(1) || null
                            }(${
                              props[hoverCardPosition.type].results[
                                hoverCardPosition.index
                              ]?.vote_count.toLocaleString() || null
                            })`,
                            new Date(
                              props[hoverCardPosition.type].results[
                                hoverCardPosition.index
                              ]?.release_date
                            ).getFullYear(),
                            new Date(
                              props[hoverCardPosition.type].results[
                                hoverCardPosition.index
                              ]?.first_air_date
                            ).getFullYear(),
                            props[hoverCardPosition.type].results[
                              hoverCardPosition.index
                            ]?.original_language,
                          ]}
                        />
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                }}
              >
                <Image
                  src={
                    hoverCardPosition.original
                      ? "/api/static" +
                          props.originalMovies[
                            hoverCardPosition.index
                          ]?.backdrop_path.replace("uploads\\", "") || ""
                      : getImageUrl(
                          props[hoverCardPosition.type].results[
                            hoverCardPosition.index
                          ]?.backdrop_path || ""
                        )
                  }
                  className={styles.backgroundImage}
                  alt={"img"}
                  height={1300 / 2}
                  width={1300}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default HomePageSliders;
