import FadeImageOnLoad from "@/components/elements/FadeImageOnLoad";
import { style } from "@mui/system";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./slider.module.scss";
import Image from "next/image";
import { getImageUrl } from "@/tmdbapi/tmdbApi";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Slider({ title, data }) {
  const length = 5;

  const itemsLength = Math.floor(data.length / length);

  const [prevIndex, setPrevIndex] = useState(itemsLength);

  const [hoverCardPosition, setHoverCardPosition] = useState({ x: 0, y: 0 });
  const [hoverCardActive, setHoverCardActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inContainer, setInContainer] = useState(false);
  const [nextIndex, setNextIndex] = useState(1);
  const timeOutRef = useRef(null);
  const hoverEndTimeOutRef = useRef(null);
  const [disable, setDisable] = useState(false);
  const disableTimeoutRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  function buttonClick() {
    setDisable(true);
    clearTimeout(disableTimeoutRef.current);

    if (!disableTimeoutRef.current) {
      console.log("clicking", disableTimeoutRef.current);
      // setHoverCardActive(false);
      // setAnimating(true);
      setIsScrolling(true);
      disableTimeoutRef.current = setTimeout(() => {
        setDisable(false);
        setIsScrolling(false);
        // setAnimating(false);
        console.log("removing", disableTimeoutRef.current);
        disableTimeoutRef.current = null;
      }, 800);
    }

    // setAnimating(true);
    // clearTimeout(timeOutRef.current);
  }

  function setIndexNext(prev) {
    const index = prev + 1;
    if (index > length - 1) {
      return 0;
    }
    return index;
  }
  function setIndexPrev(prev) {
    const index = prev - 1;
    if (index < 0) {
      return length - 1;
    }
    return index;
  }

  const handleNext = () => {
    buttonClick();
    setNextIndex(setIndexNext);
    setCurrentIndex(setIndexNext);
    setPrevIndex(setIndexNext);
  };

  const handlePrev = () => {
    buttonClick();
    setNextIndex(setIndexPrev);
    setCurrentIndex(setIndexPrev);
    setPrevIndex(setIndexPrev);
  };

  return (
    <>
      {title && <h2>{title}</h2>}
      <div className={styles.container}>
        {Array.from({ length }).map((movie, index) => {
          return (
            <motion.div
              key={index}
              // onMouseLeave={() => {
              //   setHoverCardActive(false);
              //   setHoverCardPosition({});
              //   console.log(timeOutRef.current);

              //   clearTimeout(timeOutRef.current);

              //   // setAnimating(false);
              // }}
              onMouseLeave={() => {
                if (!inContainer) {
                  setHoverCardActive(false);
                  setHoverCardPosition({});
                  console.log("hover end");
                  clearTimeout(timeOutRef.current);
                }
              }}
              onMouseMove={(e) => {
                if (e.target.id === "imageContainer") {
                  if (
                    e.target.dataset.index !== hoverCardPosition.index &&
                    index === currentIndex &&
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
                        index: e.target.dataset.index,
                      });
                      setHoverCardActive(true);
                      setInContainer(true);
                      // setAnimating(true);
                      // }
                    }, 200);
                  }
                } else {
                  setHoverCardActive(false);
                  setHoverCardPosition({});
                  console.log(timeOutRef.current);
                  clearTimeout(timeOutRef.current);
                }

                // if (
                //   e.target.id === "imageContainer" &&
                //   index === currentIndex
                // ) {
                //   if (!hoverCardActive) {
                //     if (!animating) {
                //       console.log("imageContainer");
                //       const rect = e.target.getBoundingClientRect();
                //       console.log("entering");
                //       setHoverCardPosition({
                //         x: rect.left,
                //         y: rect.top,
                //         height: rect.height,
                //         width: rect.width,
                //         index: e.target.dataset.index,
                //       });
                //       setHoverCardActive(true);
                //     } else {
                //       clearTimeout(timeOutRef.current);
                //       timeOutRef.current = setTimeout(() => {
                //         console.log("imageContainer");
                //         const rect = e.target.getBoundingClientRect();
                //         console.log("entering");
                //         setHoverCardPosition({
                //           x: rect.left,
                //           y: rect.top,
                //           height: rect.height,
                //           width: rect.width,
                //           index: e.target.dataset.index,
                //         });
                //         setHoverCardActive(true);
                //       }, 300);
                //     }
                //   } else {
                //     setHoverCardActive(false);
                //   }
                // }
              }}
              className={
                styles.item +
                " " +
                (index == nextIndex
                  ? styles.right
                  : index === prevIndex
                  ? styles.left
                  : index === currentIndex
                  ? styles.middle
                  : index === nextIndex + 1 || index < prevIndex - 1
                  ? styles.extremeRight
                  : index > nextIndex + 1 || index === prevIndex - 1
                  ? styles.extremeLeft
                  : "")
              }
            >
              {Array.from({ length: itemsLength }).map((e, imgIndex) => (
                <>
                  <FadeImageOnLoad
                    key={imgIndex + index + (itemsLength - 1) * index}
                    imageSrc={
                      index == nextIndex ||
                      index === prevIndex ||
                      index === currentIndex ||
                      index === prevIndex - 1 ||
                      index === nextIndex + 1 ||
                      index === 0 ||
                      index === length - 1
                        ? data[imgIndex + index + (itemsLength - 1) * index]
                            ?.backdrop_path || ""
                        : ""
                    }
                    //   ambientMode
                    //   positionAbsolute
                    //   ambientOptions={{ blur: 128, scale: 1 }}
                    attr={{
                      imageContainer: {
                        className: styles.imageContainer,
                        id: "imageContainer",
                        "data-index":
                          imgIndex + index + (itemsLength - 1) * index,
                      },
                      image: {
                        objectFit: "cover",
                        height: 1300 / 2,
                        width: 1300,
                      },
                    }}
                  />
                </>
              ))}
            </motion.div>
          );
        })}

        <button
          disabled={disable}
          className={styles.leftButton + " " + styles.btn}
          onClick={handlePrev}
        >
          <ArrowForwardIosIcon style={{ transform: "rotate(-180deg)" }} />
        </button>
        <button
          disabled={disable}
          className={styles.rightButton + " " + styles.btn}
          onClick={handleNext}
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
      <AnimatePresence>
        {hoverCardActive && (
          <motion.div
            style={{
              left: hoverCardPosition.x,
              top: hoverCardPosition.y,
              height: hoverCardPosition.height,
              width: hoverCardPosition.width,
            }}
            onHoverEnd={(e) => {
              // setHoverCardActive(false);
              // setAnimating(true);
              setHoverCardActive(false);
              setHoverCardPosition({});
              console.log(timeOutRef.current);
              clearTimeout(timeOutRef.current);
              setInContainer(false);
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
              }% , -30%, 50px)`,

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
    </>
  );
}

export default Slider;
