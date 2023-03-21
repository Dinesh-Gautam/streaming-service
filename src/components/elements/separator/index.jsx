import React from "react";
import styles from "./Separator.module.scss";

function Separator({ values, gap }) {
  return (
    <div style={{ gap: gap || 0 }} className={styles.separatorContainer}>
      {values
        .filter((e) => e && e !== 0 && e.toString().trim())
        .map((value, index, arr) => {
          return (
            <React.Fragment key={index}>
              <span>{value}</span>
              {index + 1 < arr.length && (
                <span className={styles.separator}></span>
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
}

export default Separator;
