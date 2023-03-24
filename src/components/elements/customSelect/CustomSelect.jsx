import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./customSelect.module.scss";
const variants = {
  container: {},
  selectBox: {},
  selectBoxOpen: {
    backgroundColor: "#f9f9f9",
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
    borderBottom: "none",
    zIndex: 5,
  },
  arrow: {
    open: {
      transform: "rotate(180deg)",
    },
    closed: {
      transform: "rotate(0deg)",
    },
  },
  optionContainer: {},
  option: {},
};

const Select = ({ options, onChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((e) => e.value === defaultValue) || null
  );

  // useEffect(() => {
  //   if (!onChange || selectedOption === null) return;
  //   onChange(selectedOption);
  // }, [selectedOption]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleSelectBoxClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      onBlur={() => setIsOpen(false)}
      onBlurCapture={() => setIsOpen(false)}
      className={styles.container}
      variants={variants.container}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
    >
      <motion.div
        className={styles.selectContainer}
        variants={variants.selectBox}
        onClick={handleSelectBoxClick}
        // style={
        //   isOpen
        //     ? {
        //         borderBottomLeftRadius: "0px",
        //         borderBottomRightRadius: "0px",
        //         borderBottom: "none",
        //       }
        //     : {}
        // }
      >
        <div>{selectedOption ? selectedOption.label : "Select season"}</div>
        <motion.svg
          style={{
            marginLeft: "1rem",
          }}
          className={styles.arrow}
          variants={variants.arrow}
          animate={isOpen ? "open" : "closed"}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            // initial="closed"
            // animate="open"
            // exit="closed"
            className={styles.optionContainer}
            variants={variants.optionContainer}
            transition={{ duration: 0.2 }}
          >
            {options.map((option) => (
              <motion.div
                className={styles.option}
                key={option.value}
                variants={variants.option}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Select;
