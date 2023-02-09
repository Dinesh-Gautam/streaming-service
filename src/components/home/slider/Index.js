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

  const [dataArr, setDataArr] = useState(data);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  const [transitionState, setTransitionState] = useState({
    transition: "",
    transform: "translateX(-100%)",
  });

  const [disable, setDisable] = useState(false);
  const disableTimeoutRef = useRef(null);
  function buttonClick(type) {
    setDisable(true);
    clearTimeout(disableTimeoutRef.current);

    if (!disableTimeoutRef.current) {
      console.log("clicking", disableTimeoutRef.current);
      // setHoverCardActive(false);
      // setAnimating(true);
      setIsScrolling(true);
      if (type === "next") {
        const transition = "transform 1s ease-in-out";
        setTransitionState({ transition, transform: "translateX(-200%)" });
      } else {
        const transition = "transform 1s ease-in-out";
        setTransitionState({ transition, transform: "translateX(0%)" });
      }
      disableTimeoutRef.current = setTimeout(() => {
        setDisable(false);
        setIsScrolling(false);
        // setAnimating(false);
        if (type === "next") {
          setTransitionState({
            transition: "",
            transform: "translateX(-100%)",
          });
        } else {
          setTransitionState({
            transition: "",
            transform: "translateX(-100%)",
          });
        }
        updateDataArr(type);
        console.log("removing", disableTimeoutRef.current);
        disableTimeoutRef.current = null;
      }, 1000);
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
    buttonClick("next");
    setNextIndex(setIndexNext);
    setCurrentIndex(setIndexNext);
    setPrevIndex(setIndexNext);
  };

  const handlePrev = () => {
    buttonClick("prev");
    setNextIndex(setIndexPrev);
    setCurrentIndex(setIndexPrev);
    setPrevIndex(setIndexPrev);
  };

  function updateDataArr(type) {
    console.log(type);
    if (type === "next") {
      const slicedArr0 = dataArr.slice(0, 5);
      const slicedArr1 = dataArr.slice(5, 10);
      const slicedArr2 = dataArr.slice(10, 15);
      const slicedArr3 = dataArr.slice(data.length - 5, 5);
      console.log(dataArr);
      setDataArr([...slicedArr3, ...slicedArr1, ...slicedArr2, ...slicedArr0]);
    } else {
      const slicedArr0 = dataArr.slice(0, 5);
      const slicedArr1 = dataArr.slice(5, 10);
      const slicedArr2 = dataArr.slice(10, 15);
      const slicedArr3 = dataArr.slice(data.length - 5, 5);

      setDataArr([...slicedArr2, ...slicedArr3, ...slicedArr0, ...slicedArr1]);
    }
    // if (type === "next") {
    //   const slicedArr0 = dataArr.slice(0, 5);
    //   const slicedArr1 = dataArr.slice(5, 5);
    //   const slicedArr2 = dataArr.slice(10, 5);
    //   const slicedArr3 = dataArr.slice(data.length - 5, 5);
    //   setDataArr([...slicedArr3, ...slicedArr1, ...slicedArr2, ...slicedArr0]);
    // } else {
    //   const slicedArr0 = dataArr.slice(0, 5);
    //   const slicedArr1 = dataArr.slice(5, 5);
    //   const slicedArr2 = dataArr.slice(10, data.length - 5);
    //   const slicedArr3 = dataArr.slice(data.length - 5, 5);
    //   setDataArr([...slicedArr2, ...slicedArr3, ...slicedArr0, slicedArr1]);
    // }
  }

  return (
    <>
      {title && <h2 style={{ marginLeft: "2rem" }}>{title}</h2>}
      {data && (
        <div className={styles.container}>
          <div
            style={{
              transition: transitionState.transition,
              transform: transitionState.transform,
            }}
            className={styles.wrapper}
          >
            {/* {Array.from({ length }).map((_, index) => {
          return (
            <motion.div
              key={index}
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
                      "data-ismiddle": currentIndex === index,
                    },
                    image: {
                      height: 1300 / 2,
                      width: 1300,
                    },
                  }}
                />
              ))}
            </motion.div>
          );
        })} */}
            {dataArr.map((e, imgIndex) => (
              <div className={styles.item} key={imgIndex}>
                <FadeImageOnLoad
                  imageSrc={e.backdrop_path || ""}
                  //   ambientMode
                  //   positionAbsolute
                  //   ambientOptions={{ blur: 128, scale: 1 }}
                  attr={{
                    imageContainer: {
                      className: styles.imageContainer,
                      // id: "imageContainer",
                      // "data-index": imgIndex + index + (itemsLength - 1) * index,
                      // "data-ismiddle": currentIndex === index,
                    },
                    image: {
                      height: 1300 / 2,
                      width: 1300,
                    },
                  }}
                />
              </div>
            ))}
          </div>
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
      )}
    </>
  );
}

export default Slider;
