import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "../../tmdbapi/tmdbApi";
import Suspense from "./Suspense";

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
    <>
      <AnimatePresence>
        {props.loadingBackground && !imageLoaded && <Suspense />}
      </AnimatePresence>
      <motion.div
        initial="initial"
        animate="animate"
        variants={!imageLoaded ? initialVariant : imageLoadedVariant}
        {...props.attr.imageContainer}
      >
        {
          <>
            {props.ambientMode && (
              <Image
                src={getImageUrl(props.imageSrc, { original: props.original })}
                alt={props.imageSrc}
                style={{
                  filter: `blur(${
                    props.ambientOptions?.blur || 24
                  }px) saturate(${
                    props.ambientOptions?.saturation ?? 1
                  }) brightness(${props.ambientOptions?.brightness ?? 1})`,
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
                {...props.attr.image}
              />
            )}
            {(props.imageSrc || props.rawImageSrc) && (
              <Image
                src={
                  !props.imageSrc
                    ? props.rawImageSrc
                    : getImageUrl(props.imageSrc, { original: props.original })
                }
                onLoadingComplete={() => setImageLoaded(true)}
                alt={props.imageSrc}
                {...props.attr.image}
              />
            )}
          </>
        }
        {props.children}
      </motion.div>
    </>
  );
}

export default FadeImageOnLoad;
