import Separator from "@/components/elements/separator";
import useYoutubePlayer from "@/components/videoPlayer/youtube/hook/useYoutubePlayer";
import YoutubeVideoPlayer from "@/components/videoPlayer/youtube/youtubeVideoPlayer";
import { getImageUrl } from "@/tmdbapi/tmdbApi";
import { PlayArrow, VolumeOff } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Slider from "./Index";
import styles from "./slider.module.scss";
function HomePageSliders({ popularMovies, originalMovies }) {
  const [hoverCardPosition, setHoverCardPosition] = useState({ x: 0, y: 0 });
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
  });
  useEffect(() => {
    const id = popularMovies.results[hoverCardPosition.index]?.id;
    setId(id);
  }, [hoverCardPosition]);

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
  // console.log(popularMovies);

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
        {originalMovies && originalMovies.length && (
          <Slider
            setIsScrolling={setIsScrolling}
            title="Original Movies"
            data={originalMovies}
          />
        )}
        <Slider
          setIsScrolling={setIsScrolling}
          title="Trending Movies"
          data={popularMovies.results}
        />
        <Slider
          setIsScrolling={setIsScrolling}
          title="Popular Movies"
          data={popularMovies.results}
        />
        <Slider
          setIsScrolling={setIsScrolling}
          title="Playing Now"
          data={popularMovies.results}
        />
        <Slider
          setIsScrolling={setIsScrolling}
          title="Top 10"
          data={popularMovies.results}
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
              }% , -25%, 50px)`,

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
            <motion.div

            // className={styles.hoverCardWrapper}
            >
              <Link
                href={
                  // "/movie" + "?id=" + originalMovies[hoverCardPosition.index]?.uid
                  "/title?id=" +
                  (hoverCardPosition.original
                    ? originalMovies[hoverCardPosition.index].uid
                    : popularMovies.results[hoverCardPosition.index].id) +
                  "&type=" +
                  "movie" +
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
                            originalMovies[
                              hoverCardPosition.index
                            ]?.backdrop_path.replace("uploads\\", "") || ""
                        : getImageUrl(
                            popularMovies.results[hoverCardPosition.index]
                              ?.backdrop_path || ""
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                  }}
                >
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
                        ? originalMovies[hoverCardPosition.index]?.title || ""
                        : popularMovies.results[hoverCardPosition.index]?.title}
                    </h1>
                    <div>
                      {!hoverCardPosition.original && <ButtonsComponent />}
                    </div>
                  </div>
                  <div>
                    {/* {hoverCardPosition.original
                        ? originalMovies[hoverCardPosition.indx]?.description ||
                          ""
                        : popularMovies.results[
                            hoverCardPosition.index
                          ]?.overview
                            ?.split(" ")
                            .splice(0, 10)
                            .join(" ") || ""} */}
                    {!hoverCardPosition.original && (
                      <Separator
                        values={[
                          `${
                            popularMovies.results[hoverCardPosition.index]
                              ?.vote_average || null
                          }(${
                            popularMovies.results[
                              hoverCardPosition.index
                            ]?.vote_count.toLocaleString() || null
                          })`,
                          new Date(
                            popularMovies.results[
                              hoverCardPosition.index
                            ]?.release_date
                          ).getFullYear(),
                        ]}
                      />
                    )}
                  </div>
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
                          originalMovies[
                            hoverCardPosition.index
                          ]?.backdrop_path.replace("uploads\\", "") || ""
                      : getImageUrl(
                          popularMovies.results[hoverCardPosition.index]
                            ?.backdrop_path || ""
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
