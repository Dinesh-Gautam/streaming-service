import FadeImageOnLoad from "@/components/elements/FadeImageOnLoad";
import { style } from "@mui/system";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./slider.module.scss";
import Image from "next/image";
import { getImageUrl } from "@/tmdbapi/tmdbApi";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Slider({ title, data, setIsScrolling }) {
  const length = 5;

  const itemsLength = Math.floor(data.length / length);

  const [prevIndex, setPrevIndex] = useState(itemsLength);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  const [disable, setDisable] = useState(false);
  const disableTimeoutRef = useRef(null);
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
      {title && <h2 style={{ marginLeft: "2rem" }}>{title}</h2>}
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
                        "data-isMiddle": currentIndex === index,
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
    </>
  );
}

export default Slider;
