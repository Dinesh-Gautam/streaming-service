import { getImageUrl } from "@/tmdbapi/tmdbApi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import Slider from "./Index";
import styles from "./slider.module.scss";
function HomePageSliders({ popularMovies, originalMovies }) {
  const [hoverCardPosition, setHoverCardPosition] = useState({ x: 0, y: 0 });
  const [hoverCardActive, setHoverCardActive] = useState(false);
  const [inContainer, setInContainer] = useState(false);
  const timeOutRef = useRef(null);
  const clearingInterval = useRef(false);

  const [isScrolling, setIsScrolling] = useState(false);

  async function clearHover() {
    if (timeOutRef.current) {
      setHoverCardActive(false);
      setHoverCardPosition({});
      console.log(timeOutRef.current);
      clearTimeout(timeOutRef.current);
      timeOutRef.current = null;
      setInContainer(false);
    }
  }
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
        <Slider
          setIsScrolling={setIsScrolling}
          title="Original Movies"
          data={originalMovies}
        />
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
              setInContainer(true);
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
            }}
            onAnimationStart={() => {
              // setAnimating(true);
            }}
            className={styles.hoverCard}
          >
            <Link
              href={
                "/movie" + "?id=" + originalMovies[hoverCardPosition.index]?.uid
              }
            >
              <div className={styles.hoverCardWrapper}>
                <div className={styles.imageContainer}>
                  <Image
                    src={
                      hoverCardPosition.original
                        ? "/api/static/" +
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
                </div>
                <div className={styles.hoverCardInfo}>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    {hoverCardPosition.original
                      ? originalMovies[hoverCardPosition.index]?.title || ""
                      : popularMovies.results[hoverCardPosition.index]?.title}
                  </motion.span>
                </div>
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
                        ? "/api/static/" +
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
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default HomePageSliders;
