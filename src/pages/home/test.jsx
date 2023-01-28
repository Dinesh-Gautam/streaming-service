import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import styles from "../../components/home/banner.module.scss";
import FadeImageOnLoad from "../../components/elements/FadeImageOnLoad";
import Image from "next/image";
import { getImageUrl } from "../../tmdbapi/tmdbApi";
function Test() {
  const router = useRouter();

  return (
    <motion.div
      style={{
        height: "100vh",
        width: "100vw",
        position: "absolute",
      }}
      layoutId={"banner1"}
      className={styles.bannerImageContainer}
    >
      <Image
        src={getImageUrl(router.query.q)}
        alt={router.query.q}
        height={1300 / 2}
        width={1300}
        // style={{
        //   height: "100%",
        //   width: "100%",
        // }}
      />
    </motion.div>
  );
}

export default Test;
