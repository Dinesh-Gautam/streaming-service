import React from "react";
import { motion } from "framer-motion";
function Suspense() {
  return (
    <motion.div
      initial={{
        opacity: 1,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      style={{
        background: "rgba(255,255,255,0.1)",
        height: "100%",
        width: "100%",
        borderRadius: 12,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    ></motion.div>
  );
}

export default Suspense;
