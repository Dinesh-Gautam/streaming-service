import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "../tmdbapi/tmdbApi";

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
      initial="initial"
      animate="animate"
      variants={!imageLoaded ? initialVariant : imageLoadedVariant}
      {...props.attr.imageContainer}
    >
      {
        <Image
          src={getImageUrl(props.imageSrc)}
          onLoadingComplete={() => setImageLoaded(true)}
          alt={props.imageSrc}
          //   objectFit="cover"
          //   height={208}
          //   width={148}
          {...props.attr.image}
        />
      }
    </motion.div>
  );
}

export default FadeImageOnLoad;
