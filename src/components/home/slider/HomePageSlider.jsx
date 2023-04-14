import Separator from "@/components/elements/separator";
import YoutubeVideoPlayer from "@/components/videoPlayer/youtube/youtubeVideoPlayer";
import { getImageUrl } from "@/tmdbapi/tmdbApi";
import { Star } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  useState,
} from "react";
import Slider from "./Slider";
import styles from "./slider.module.scss";
import YoutubeVideoPlayerProvider from "../../videoPlayer/youtube/youtubePlayerContext";
import YoutubeControlButtons from "../../videoPlayer/youtube/youtubePlayerControlsButtons";
function HomePageSliders(props) {
  return (
    <HoverCardProvider {...props}>
      {props.originalMovies && props.originalMovies.length && (
        <Slider
          title="Original Movies"
          data={props.originalMovies}
          type={"originalMovies"}
        />
      )}
      <Slider
        title="Trending Movies"
        data={props.trendingMovies}
        type={"trendingMovies"}
      />
      <Slider title="Now Playing" data={props.nowPlaying} type={"nowPlaying"} />

      <Slider
        title="Trending Tv Shows"
        data={props.trendingTv}
        type={"trendingTv"}
      />
      <Slider
        title="Top 10"
        data={props.popularMovies}
        type={"popularMovies"}
      />
    </HoverCardProvider>
  );
}

const HoverCardProvider = (props) => {
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

  const [animating, setAnimating] = useState(true);

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
  function getHoverCardMovie() {
    return props[hoverCardPosition.type || "popularMovies"][
      hoverCardPosition.index ?? 0
    ];
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          zIndex: 10,
        }}
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
              setHoverCardActive(false);
              setAnimating(true);
              clearTimeout(timeOutRef.current);
              timeOutRef.current = setTimeout(() => {
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
              }, 300);
            }
          } else {
            if (timeOutRef.current && !clearingInterval.current) {
              clearHover();
            }
          }
        }}
      >
        {Children.map(props.children, (child) => {
          if (!isValidElement(child)) return null;
          return cloneElement(child, { ...child.props, setIsScrolling });
        })}
      </div>
      <YoutubeVideoPlayerProvider
        id={getHoverCardMovie()?.id}
        media_type={getHoverCardMovie()?.media_type || "movie"}
      >
        <HoverCard
          context={{
            hoverCardPosition,
            hoverCardActive,
            timeOutRef,
            animating,
            setAnimating,
            clearHover,
            getHoverCardMovie,
          }}
        />
      </YoutubeVideoPlayerProvider>
    </>
  );
};

const HoverCard = ({ context }) => {
  const {
    hoverCardPosition,
    hoverCardActive,
    timeOutRef,
    animating,
    setAnimating,
    clearHover,
    getHoverCardMovie,
  } = context;
  return (
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
            if (!timeOutRef.current) return;
            clearHover();
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
            setAnimating(false);
          }}
          className={styles.hoverCard}
        >
          <motion.div className={styles.hoverCardWrapper}>
            <Link
              href={
                "/title?id=" +
                (getHoverCardMovie()?.id || getHoverCardMovie()?.uid) +
                "&type=" +
                (getHoverCardMovie()?.media_type || "movie") +
                "&t=hover" +
                "&original=" +
                (hoverCardPosition.original === "true" ? "true" : "false")
              }
            >
              <motion.div layoutId={"hover"} className={styles.imageContainer}>
                {!hoverCardPosition.original && !animating && (
                  <YoutubeVideoPlayer />
                )}
                <Image
                  src={
                    hoverCardPosition.original
                      ? "/api/static" + getHoverCardMovie()?.backdrop_path || ""
                      : getImageUrl(getHoverCardMovie()?.backdrop_path || "")
                  }
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
                    {getHoverCardMovie()?.title || getHoverCardMovie().name}
                  </h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    {!hoverCardPosition.original && <YoutubeControlButtons />}
                  </motion.div>
                </div>
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
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {hoverCardPosition.original ? (
                      <Separator
                        values={[
                          new Date(
                            getHoverCardMovie()?.first_air_date
                          ).getFullYear(),
                        ]}
                      />
                    ) : (
                      <>
                        <Star color="warning" fontSize="small" />
                        <Separator
                          values={[
                            `${
                              getHoverCardMovie()?.vote_average.toFixed(1) ||
                              null
                            }(${
                              getHoverCardMovie()?.vote_count.toLocaleString() ||
                              null
                            })`,
                            new Date(
                              getHoverCardMovie()?.release_date
                            ).getFullYear(),
                            new Date(
                              getHoverCardMovie()?.first_air_date
                            ).getFullYear(),
                            getHoverCardMovie()?.original_language,
                          ]}
                        />
                      </>
                    )}
                  </div>
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
                    ? "/api/static" + getHoverCardMovie()?.backdrop_path || ""
                    : getImageUrl(getHoverCardMovie()?.backdrop_path || "")
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
  );
};

export default HomePageSliders;
