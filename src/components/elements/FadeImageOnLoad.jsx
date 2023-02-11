import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "../../tmdbapi/tmdbApi";

function FadeImageOnLoad(props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const initialVariant = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 0,
    },
  };
  const imageLoadedVariant = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        type: "ease",
        ease: "easeOut",
        delay: 0.2,
        duration: props.duration || 1,
      },
    },
  };
  return (
    <motion.div
      // style={{
      //   position: "relative",
      // }}
      initial="initial"
      animate="animate"
      variants={!imageLoaded ? initialVariant : imageLoadedVariant}
      {...props.attr.imageContainer}
    >
      {
        <>
          {props.ambientMode && props.imageSrc && (
            <Image
              src={getImageUrl(props.imageSrc)}
              // onLoadingComplete={() => setImageLoaded(true)}
              alt={props.imageSrc}
              style={{
                filter: `blur(${props.ambientOptions?.blur || 24}px)`,
                opacity: 0.7,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%,-50%) scale(${
                  props.ambientOptions?.scale || 2
                })`,
                ...props.ambientOptions,
                zIndex: -100,
              }}
              //   objectFit="cover"
              //   height={208}
              //   width={148}
              {...props.attr.image}
            />
          )}
          {(props.imageSrc || props.rawImageSrc) && (
            <Image
              src={
                !props.imageSrc
                  ? props.rawImageSrc
                  : getImageUrl(props.imageSrc)
              }
              onLoadingComplete={() => setImageLoaded(true)}
              alt={props.imageSrc}
              //   objectFit="cover"
              //   height={208}
              //   width={148}
              {...props.attr.image}
            />
          )}
        </>
      }
    </motion.div>
  );
}

export default FadeImageOnLoad;
