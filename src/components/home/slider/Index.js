import FadeImageOnLoad from "@/components/elements/FadeImageOnLoad";
import { style } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./slider.module.scss";
import Image from "next/image";
import { getImageUrl } from "@/tmdbapi/tmdbApi";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Slider({ title, data, setIsScrolling }) {
  const isMiniSlider = data.length < 6;
  const [dataArr, setDataArr] = useState(updateDataArr("before"));
  const [transitionState, setTransitionState] = useState({
    transition: "",
    transform: "translateX(-140%)",
  });
  const [disable, setDisable] = useState(false);
  const disableTimeoutRef = useRef(null);

  function buttonClick(type) {
    setDisable(true);
    clearTimeout(disableTimeoutRef.current);

    if (!disableTimeoutRef.current) {
      console.log("clicking", disableTimeoutRef.current);
      setIsScrolling(true);
      const transition = "transform 1s ease-in-out";
      if (type === "next") {
        setTransitionState({ transition, transform: "translateX(-240%)" });
      } else {
        setTransitionState({ transition, transform: "translateX(-40%)" });
      }
      disableTimeoutRef.current = setTimeout(() => {
        setDisable(false);
        setIsScrolling(false);
        if (type === "next") {
          setTransitionState({
            transition: "",
            transform: "translateX(-140%)",
          });
        } else {
          setTransitionState({
            transition: "",
            transform: "translateX(-140%)",
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

  function handleNext() {
    buttonClick("next");
  }

  function handlePrev() {
    buttonClick("prev");
  }

  function updateDataArr(type) {
    let slicedArr0, slicedArr1, slicedArr3;
    if (type === "next") {
      (slicedArr0 = dataArr.slice(0, 5)),
        (slicedArr1 = dataArr.slice(5, data.length - 7)),
        (slicedArr3 = dataArr.slice(data.length - 7, data.length));
      setDataArr([...slicedArr1, ...slicedArr3, ...slicedArr0]);
    } else if (type === "before") {
      slicedArr0 = data.slice(0, 5);
      slicedArr1 = data.slice(5, data.length - 7);
      slicedArr3 = data.slice(data.length - 7, data.length);
      return [...slicedArr3, ...slicedArr0, ...slicedArr1];
    } else {
      slicedArr0 = dataArr.slice(0, 5);
      slicedArr1 = dataArr.slice(5, data.length - 5);
      slicedArr3 = dataArr.slice(data.length - 5, data.length);
      setDataArr([...slicedArr3, ...slicedArr0, ...slicedArr1]);
    }
  }

  return (
    <>
      {title && <h2 style={{ marginLeft: "2rem" }}>{title}</h2>}
      {isMiniSlider ? (
        <div className={styles.container}>
          <div style={{}} className={styles.wrapper}>
            {data.map((e, index) => (
              <div className={styles.item} key={index}>
                <FadeImageOnLoad
                  rawImageSrc={
                    "/api/static/" + e.backdrop_path.replace("uploads\\", "")
                  }
                  attr={{
                    imageContainer: {
                      className: styles.imageContainer,
                      id: "imageContainer",
                      "data-index": data.indexOf(e),
                      "data-original": "true",
                      "data-middle": true,
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
        </div>
      ) : (
        dataArr && (
          <div className={styles.container}>
            <div
              style={{
                transition: transitionState.transition,
                transform: transitionState.transform,
              }}
              className={styles.wrapper}
            >
              {dataArr.map((e, index) => (
                <div className={styles.item} key={index}>
                  <FadeImageOnLoad
                    imageSrc={e.backdrop_path || ""}
                    attr={{
                      imageContainer: {
                        className: styles.imageContainer,
                        id: "imageContainer",
                        "data-index": data.indexOf(e),
                        "data-middle": index > 6 && index < 12,
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
        )
      )}
    </>
  );
}

export default Slider;
