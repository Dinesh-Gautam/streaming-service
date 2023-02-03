import { getImageUrl } from "@/tmdbapi/tmdbApi";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useRef, useState } from "react";

import styles from "./slider.module.scss";

function useHoverCard(data) {
  const [hoverCardPosition, setHoverCardPosition] = useState({ x: 0, y: 0 });
  const [hoverCardActive, setHoverCardActive] = useState(false);
  const [animating, setAnimating] = useState(false);

  const timeOutRef = useRef();

  return {
    animating,
    setHoverCardActive,
    hoverCardActive,
    setHoverCardPosition,
    timeOutRef,
    Component: () => (
      <AnimatePresence>
        {hoverCardActive && (
          <motion.div
            style={{
              left: hoverCardPosition.x,
              top: hoverCardPosition.y,
              height: hoverCardPosition.height,
              width: hoverCardPosition.width,
            }}
            onMouseLeave={(e) => {
              setHoverCardActive(false);
              setAnimating(true);
            }}
            onHoverEnd={() => {
              setHoverCardActive(false);
              setAnimating(true);
            }}
            initial={{
              transform: "perspective(200px) translate3d(0, 0%, 0px)",
            }}
            animate={{
              transform: "perspective(200px) translate3d(0 , -30%, 50px)",
              duration: 1,
              type: "ease",
            }}
            exit={{ transform: "perspective(200px) translate3d(0, 0%, 0px)" }}
            transition={{
              type: "ease",
              ease: "easeInOut",
            }}
            onAnimationComplete={() => {
              setAnimating(false);
            }}
            onAnimationStart={() => {
              setAnimating(true);
            }}
            className={styles.hoverCard}
          >
            <div className={styles.imageContainer}>
              <Image
                src={getImageUrl(
                  data[hoverCardPosition.index]?.backdrop_path || ""
                )}
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
            </div>
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                }}
              >
                {data[hoverCardPosition.index].title}
              </motion.span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
              }}
            >
              {/* <Image
            src={getImageUrl(
              data[hoverCardPosition.index]?.backdrop_path || ""
            )}
            //   ambientMode
            //   positionAbsolute
            //   ambientOptions={{ blur: 128, scale: 1 }}
            alt={"img"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              filter: "blur(64px)",
              zIndex: 1,
            }}
            objectFit={"cover"}
            height={1300 / 2}
            width={1300}
          /> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    ),
  };
}

export default useHoverCard;
