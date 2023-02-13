import { formatParagraph } from "@/Utils";
import React, { useState } from "react";
import FadeImageOnLoad from "./elements/FadeImageOnLoad";
import Separator from "./elements/Separator";
import { motion } from "framer-motion";
import styles from "./View.module.scss";
import Image from "next/image";
import { getImageUrl } from "@/tmdbapi/tmdbApi";

function TitleView({ result, type }) {
  const [animating, setAnimating] = useState(true);
  return (
    <motion.div
      layout
      onAnimationEnd={() => {
        setAnimating(false);
      }}
      layoutId={type === "hover" ? type : type + result.id}
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
            result.genres
              .map((gen, index, { length }) =>
                index + 1 == length ? gen.name + " " : gen.name + ", "
              )
              .join(" "),
            new Date(result?.first_air_date).getFullYear(),
          ]}
        />
        <div>
          <p>{formatParagraph(result.overview)}</p>
        </div>
        <div>
          <button
          // onClick={
          // () =>
          // router.push(
          //   `api/videoStream?ih=${videoFileInfo.infoHash}&i=${videoFileInfo.videoFileIndex}`
          // )
          // }
          >
            Watch Now
            {/* <PlayArrowIcon fontSize="large" /> */}
          </button>
        </div>
      </div>
      {!animating && (
        <FadeImageOnLoad
          imageSrc={result.poster_path || result.backdrop_path}
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
        <Image
          src={getImageUrl(result.backdrop_path || result.poster_path)}
          alt="image"
          fill
        />
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
