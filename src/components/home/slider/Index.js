import FadeImageOnLoad from "@/components/elements/FadeImageOnLoad";
import { style } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./slider.module.scss";
import Image from "next/image";
import { getImageUrl } from "@/tmdbapi/tmdbApi";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Slider({ title, data, setIsScrolling, type }) {
  const isMiniSlider = data?.length < 6;
  const [ItemsLength, setItemsLength] = useState(5);
  const [dataArr, setDataArr] = useState(updateDataArr("before"));

  const [windowWidth, setWindowWidth] = useState(null);
  const transforms = {
    5: 140,
    4: 150,
    3: 166.5,
    2: 200,
    1: 300,
  };

  const [transitionState, setTransitionState] = useState({
    transition: "",
    transform: "",
  });
  const [disable, setDisable] = useState(false);
  const disableTimeoutRef = useRef(null);

  const [itemWidth, setItemWidth] = useState(20);

  useEffect(() => {
    // const itemsLength =
    //   Math.min(Math.ceil(window.innerWidth / 4 / 100), 5) || 1;
    // const widthPercent =
    //   (window.innerWidth / itemsLength / window.innerWidth) * 100;
    // setItemWidth(widthPercent);
    // setItemsLength(itemsLength);
    // setTransitionState((prev) => ({
    //   ...prev,
    //   transform: `translateX(-${transforms[itemsLength]}%)`,
    // }));
    const resizeHandler = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize ", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (ItemsLength !== null) {
      console.info("changing items width");
      const widthPercent =
        (window.innerWidth / ItemsLength / window.innerWidth) * 100;
      setItemWidth(widthPercent);
      setTransitionState((prev) => ({
        ...prev,
        transform: `translateX(-${transforms[ItemsLength]}%)`,
      }));
      setDataArr(updateDataArr("before"));
    }
  }, [ItemsLength]);

  useEffect(() => {
    const itemsLength =
      Math.min(Math.ceil(window.innerWidth / 4 / 100), 5) || 1;

    setItemsLength(itemsLength);
  }, [windowWidth]);

  function buttonClick(type) {
    setDisable(true);
    clearTimeout(disableTimeoutRef.current);

    if (!disableTimeoutRef.current) {
      console.log("clicking", disableTimeoutRef.current);
      setIsScrolling(true);
      const transition = "transform 1s ease-in-out";
      if (type === "next") {
        setTransitionState({
          transition,
          transform: `translateX(-${transforms[ItemsLength] + 100}%)`,
        });
      } else {
        setTransitionState({
          transition,
          transform: `translateX(-${transforms[ItemsLength] - 100}%)`,
        });
      }
      disableTimeoutRef.current = setTimeout(() => {
        setDisable(false);
        setIsScrolling(false);
        if (type === "next") {
          setTransitionState({
            transition: "",
            transform: `translateX(-${transforms[ItemsLength]}%)`,
          });
        } else {
          setTransitionState({
            transition: "",
            transform: `translateX(-${transforms[ItemsLength]}%)`,
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
      (slicedArr0 = dataArr.slice(0, ItemsLength)),
        (slicedArr1 = dataArr.slice(
          ItemsLength,
          data.length - (ItemsLength + 2)
        )),
        (slicedArr3 = dataArr.slice(
          data.length - (ItemsLength + 2),
          data.length
        ));
      setDataArr([...slicedArr1, ...slicedArr3, ...slicedArr0]);
    } else if (type === "before") {
      slicedArr0 = data.slice(0, ItemsLength);
      slicedArr1 = data.slice(ItemsLength, data.length - (ItemsLength + 2));
      slicedArr3 = data.slice(data.length - (ItemsLength + 2), data.length);
      return [...slicedArr3, ...slicedArr0, ...slicedArr1];
    } else {
      slicedArr0 = dataArr.slice(0, ItemsLength);
      slicedArr1 = dataArr.slice(ItemsLength, data.length - ItemsLength);
      slicedArr3 = dataArr.slice(data.length - ItemsLength, data.length);
      setDataArr([...slicedArr3, ...slicedArr0, ...slicedArr1]);
    }
  }

  return (
    data && (
      <>
        {title && <h2 style={{ marginLeft: "2rem" }}>{title}</h2>}
        {isMiniSlider ? (
          <div className={styles.container}>
            <div className={styles.wrapper}>
              {data.map((e, index) => (
                <div
                  style={{ width: itemWidth + "%" }}
                  className={styles.item}
                  key={index}
                >
                  <FadeImageOnLoad
                    loadingBackground
                    rawImageSrc={
                      "/api/static" + e.backdrop_path.replace("uploads\\", "")
                    }
                    attr={{
                      imageContainer: {
                        className: styles.imageContainer,

                        id: "imageContainer",
                        "data-index": data.indexOf(e),
                        "data-original": "true",
                        "data-type": type,
                        "data-middle": true,
                      },
                      image: {
                        priority: true,
                        height: 1300 / 2,
                        width: 1300,
                      },
                    }}
                  />
                  <h1
                    style={{
                      width: "62%",
                      lineHeight: "100%",
                      fontSize: 19,
                      padding: "0.5rem 1rem",
                      position: "absolute",
                      marginTop: 18,
                    }}
                  >
                    {e.title}
                  </h1>
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
                  <div
                    style={{ width: itemWidth + "%" }}
                    className={styles.item}
                    key={index}
                  >
                    <FadeImageOnLoad
                      loadingBackground
                      imageSrc={e.backdrop_path}
                      attr={{
                        imageContainer: {
                          className: styles.imageContainer,
                          id: "imageContainer",
                          "data-index": data.indexOf(e),
                          "data-middle":
                            index > ItemsLength + 1 &&
                            index < ItemsLength * 2 + 2,
                          "data-type": type,
                        },
                        image: {
                          priority:
                            index > ItemsLength + 1 &&
                            index < ItemsLength * 2 + 2,
                          height: 1300 / 2,
                          width: 1300,
                        },
                      }}
                    />
                    <h1
                      style={{
                        width: "62%",
                        lineHeight: "100%",
                        fontSize: 19,
                        padding: "0.5rem 1rem",
                        position: "absolute",
                        marginTop: 12,
                      }}
                    >
                      {e.title || e.name}
                    </h1>
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
    )
  );
}

export default Slider;
