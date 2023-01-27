import React from "react";
import styles from "./Separator.module.scss";

function Separator({ values, gap }) {
  return (
    <div style={{ gap: gap || 0 }} className={styles.separatorContainer}>
      {values.map((value, index) => {
        return (
          <React.Fragment key={index}>
            <span>{value}</span>
            {index + 1 < values.length && (
              <span className={styles.separator}></span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Separator;
