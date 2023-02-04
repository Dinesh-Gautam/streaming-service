import React, { useEffect } from "react";

import styles from "./SearchResult.module.scss";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import FadeImageOnLoad from "./elements/FadeImageOnLoad";
import Separator from "./elements/Separator";
// import { arrowVariant } from "./MotionVariants";
import { useViewRedirect } from "../Utils";

const arrowVariant = {
  rest: {
    x: -50,
    opacity: 0,
  },
  hover: {
    x: 0,
    opacity: 0.8,
    transition: {
      type: "ease",
      ease: "easeOut",
      duration: 0.5,
    },
  },
};

function SearchResult({ results }) {
  return (
    <div className={styles.container}>
      {results.map((item) => {
        return <Results item={item} key={item.id} />;
      })}
    </div>
  );
}

function Results({ item }) {
  const onClick = useViewRedirect();
  return (
    <motion.div style={{ cursor: "pointer" }} onClick={onClick(item)}>
      <motion.div
        initial="rest"
        animate="rest"
        whileHover="hover"
        className={styles.itemContainer}
        key={item.id}
      >
        <div>
          <motion.div className={styles.item}>
            <FadeImageOnLoad
              imageSrc={item.poster_path}
              attr={{
                imageContainer: { className: styles.imageContainer },
                image: {
                  objectFit: "cover",
                  height: 208,
                  width: 148,
                },
              }}
            />
            <div className={styles.infoContainer}>
              <div className={styles.header}>
                <motion.h1>
                  {item.title ||
                    item.name ||
                    item.original_title ||
                    item.original_name}
                </motion.h1>
                <Separator
                  gap={4}
                  values={[
                    item.media_type,
                    item.genre_ids.map((gen, index, { length }) =>
                      index + 1 == length ? gen.name + " " : gen.name + ", "
                    ),
                    new Date(item.first_air_date).getFullYear(),
                  ]}
                />
              </div>
              <div className={styles.description}>
                <p>{item.overview}</p>
              </div>
            </div>
            <motion.div className={styles.arrowRight} variants={arrowVariant}>
              <ArrowForwardIcon fontSize="large" />
            </motion.div>
          </motion.div>

          <FadeImageOnLoad
            imageSrc={item.poster_path}
            attr={{
              imageContainer: { className: styles.backgroundImg },
              image: {
                objectFit: "cover",
                height: 208,
                width: 548,
              },
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SearchResult;
