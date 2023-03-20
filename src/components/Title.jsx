import { formatParagraph } from "@/utils";
import React, { useRef, useState } from "react";
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
  },
  animate: {
    opacity: 0,
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
      <div className={styles.leftContainer}>
        <div>
          <h1>
            {result.title ||
              result.name ||
              result.original_title ||
              result.original_name}
          </h1>
        </div>
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Star color="warning" />
          <Separator
            values={[
              `${result?.vote_average || null} (${
                result?.vote_count?.toLocaleString() || null
              })`,
            ]}
          />
        </div>
        <div>
          <p>{formatParagraph(result.overview || result.description)}</p>
        </div>
        <div>
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
        </div>
      </div>
      {!animating && (
        <FadeImageOnLoad
          imageSrc={result.poster_path}
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
      )}

      <div className={styles.backdropImage + " " + styles.backdropImageBlurred}>
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
      </div>
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
