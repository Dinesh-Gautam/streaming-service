import { signOut } from "next-auth/react";
import Search from "../search/index";
import styles from "./nav.module.scss";
function Nav({ searchInitialValue }) {
  return (
    <div className={styles.navContainer}>
      <div className={styles.navRightContainer}></div>
      <Search initialValue={searchInitialValue} />
      <div className={styles.navLeftContainer}>
        <button
          onClick={() =>
            signOut({
              redirect: "/",
            })
          }
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Nav;
