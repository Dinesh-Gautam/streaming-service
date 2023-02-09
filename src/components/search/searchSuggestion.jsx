import FadeImageOnLoad from "../elements/FadeImageOnLoad";
import Separator from "../elements/Separator";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useViewRedirect } from "../../Utils";
import styles from "./search.module.scss";

function Suggestions({ searchSuggestions }) {
  const mainContainerRef = useRef(null);
  const containerRef = useRef(null);
  const onClick = useViewRedirect();
  const [height, setHeight] = useState(0);

  const maxHeight = innerHeight / 3;

  useEffect(() => {
    if (maxHeight) {
      setHeight(Math.min(containerRef.current?.offsetHeight, maxHeight) || 0);
    }
  }, [searchSuggestions, maxHeight]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { ease: "easeOut", delay: 0.2, duration: 0.3 },
      }}
      exit={{
        opacity: 0,
        height: 0,
      }}
      style={{
        height: height,
        transition: `height 0.5s ease-out`,
        cursor: "pointer",
      }}
      ref={mainContainerRef}
      className={styles.suggestionContainer}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
        ref={containerRef}
      >
        {searchSuggestions.map((suggestion) => {
          return (
            <motion.div
              layout
              transition={{ type: "ease", duration: 0.5 }}
              onClick={onClick(suggestion)}
              className={styles.suggestionResultContainer}
              key={suggestion.id}
            >
              <FadeImageOnLoad
                imageSrc={suggestion.poster_path}
                ambientMode
                ambientOptions={{
                  top: 0,
                  left: 0,
                  transform: "translate(0% , 0%)",
                }}
                attr={{
                  imageContainer: {
                    className: styles.suggestionImageContainer,
                  },
                  image: { height: 80, width: 60 },
                }}
              />
              {/* <FadeImageOnLoad
                imageSrc={suggestion.poster_path}
                attr={{
                  imageContainer: {
                    className: styles.backgroundImageContainer,
                  },
                  image: { objectFit: "cover", height: 100, width: 200 },
                }}
              /> */}
              <div className={styles.suggestionInfoContainer}>
                <h4>
                  {suggestion.title ||
                    suggestion.name ||
                    suggestion.original_title ||
                    suggestion.original_name}
                </h4>
                <Separator
                  gap={4}
                  values={[
                    suggestion.media_type,
                    new Date(suggestion.first_air_date).getFullYear(),
                  ]}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default Suggestions;
