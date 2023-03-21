import { formatParagraph } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import FadeImageOnLoad from "./elements/FadeImageOnLoad";
import Separator from "./elements/separator";
import { LayoutGroup, motion } from "framer-motion";
import styles from "./View.module.scss";
import Image from "next/image";
import { getImageUrl } from "@/tmdbapi/tmdbApi";
import { PlayArrowRounded, Star } from "@mui/icons-material";
import Link from "next/link";
import YoutubeVideoPlayer from "./videoPlayer/youtube/youtubeVideoPlayer";
import useYoutubePlayer from "./videoPlayer/youtube/hook/useYoutubePlayer";

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
  });

  const [hideAll, setHideAll] = useState(false);

  const hideTimeOutRef = useRef(null);
  useEffect(() => {
    if (!playerState.playing) return;
    console.log(playerState);
    clearTimeout(hideTimeOutRef.current);
    hideTimeOutRef.current = setTimeout(() => {
      console.log("clearing timeout ref in useEffect");
      setHideAll(true);
    }, 5000);
  }, [playerState]);

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
                ]}
              />
            </div>
          )}
          <div>
            <p>{formatParagraph(result.overview || result.description)}</p>
          </div>
        </motion.div>
        <motion.div
          layout
          style={
            playerState.playing
              ? {
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  padding: "4rem",
                  width: "50%",
                }
              : {
                  position: "relative",
                  width: "50%",
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
                Watch Now
                <span>
                  <PlayArrowRounded fontSize="large" />
                </span>
              </button>
            </Link>
          )}

          <ButtonsComponent />
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
          if (!playerState.playing) return;
          console.log("hovering");
          setHideAll(false);
          clearTimeout(hideTimeOutRef.current);
          hideTimeOutRef.current = setTimeout(() => {
            console.log("clearing timeout ref in useEffect");
            setHideAll(true);
          }, 5000);
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
