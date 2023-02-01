import FadeImageOnLoad from "@/components/elements/FadeImageOnLoad";
import React, { useRef, useState } from "react";
import styles from "./slider.module.scss";
function Slider({ data }) {
  const popularMovies = { length: 5 };

  const itemsLength = Math.floor(data.length / 5);

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

      disableTimeoutRef.current = setTimeout(() => {
        setDisable(false);
        console.log("removing", disableTimeoutRef.current);
        disableTimeoutRef.current = null;
      }, 800);
    }
  }

  function setIndexNext(prev) {
    const index = prev + 1;
    if (index > popularMovies.length - 1) {
      return 0;
    }
    return index;
  }
  function setIndexPrev(prev) {
    const index = prev - 1;
    if (index < 0) {
      return popularMovies.length - 1;
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
    <div className={styles.container}>
      {Array.from({ length: itemsLength }).map((movie, index) => {
        return (
          <div
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
            {Array.from({ length: 5 }).map((e, imgIndex) => (
              <FadeImageOnLoad
                key={imgIndex}
                imageSrc={
                  data[imgIndex + index + itemsLength * index]?.backdrop_path ||
                  ""
                }
                //   ambientMode
                //   positionAbsolute
                //   ambientOptions={{ blur: 128, scale: 1 }}
                attr={{
                  imageContainer: {
                    className: styles.imageContainer,
                  },
                  image: {
                    objectFit: "cover",
                    height: 1300 / 2,
                    width: 1300,
                  },
                }}
              />
            ))}
          </div>
        );
      })}

      <button
        disabled={disable}
        className={styles.leftButton}
        onClick={handlePrev}
      >
        {"<"}
      </button>
      <button
        disabled={disable}
        className={styles.rightButton}
        onClick={handleNext}
      >
        {">"}
      </button>
    </div>
  );
}

export default Slider;
