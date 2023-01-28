import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getImageUrl } from "../../tmdbapi/tmdbApi";
import styles from "./banner.module.scss";
import FadeImageOnLoad from "../elements/FadeImageOnLoad";
import Link from "next/link";
import { red } from "@mui/material/colors";

const PopularMoviesBanner = ({ popularMovies }) => {
  const [prevIndex, setPrevIndex] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(1);

  const [nextIndex, setNextIndex] = useState(2);

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
    <>
      <div className={styles.bannerContainer}>
        {popularMovies.map((movie, index) => {
          return (
            <div
              key={index}
              className={
                styles.banner +
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
              <Link
                href={
                  "/home/test?q=" +
                  popularMovies[index].backdrop_path +
                  "&i=" +
                  index
                }
              >
                <FadeImageOnLoad
                  imageSrc={popularMovies[index].backdrop_path}
                  ambientMode
                  positionAbsolute
                  ambientOptions={{ blur: 128, scale: 1 }}
                  attr={{
                    imageContainer: {
                      layoutId: "banner" + index,
                      className: styles.bannerImageContainer,
                    },
                    image: {
                      objectFit: "cover",
                      height: 1300 / 2,
                      width: 1300,
                    },
                  }}
                />
              </Link>
            </div>
          );
        })}
        {/* <div className={styles.banner + " " + styles.left}> */}
        {/* <Image
          src={getImageUrl(popularMovies[prevIndex].backdrop_path)}
          alt={popularMovies[prevIndex].title}
          width={200}
          height={200}
        /> */}
        {/* <h3>{popularMovies[prevIndex].title}</h3> */}
        {/* </div> */}
        {/* <div className={styles.banner + " " + styles.middle}> */}
        {/* <Image
          src={getImageUrl(popularMovies[currentIndex].backdrop_path)}
          alt={popularMovies[currentIndex].title}
          width={500}
          height={300}
        /> */}
        {/* <h3>{popularMovies[currentIndex].title}</h3> */}
        {/* </div> */}
        {/* <div className={styles.banner + " " + styles.right}> */}
        {/* <Image
          src={getImageUrl(popularMovies[nextIndex].backdrop_path)}
          alt={popularMovies[nextIndex].title}
          width={200}
          height={200}
        /> */}
        {/* <h3>{popularMovies[nextIndex].title}</h3> */}
        {/* </div> */}
        <button
          disabled={disable}
          className={styles.leftButton}
          onClick={handlePrev}
        >
          Previous
        </button>
        <button
          disabled={disable}
          className={styles.rightButton}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default PopularMoviesBanner;
