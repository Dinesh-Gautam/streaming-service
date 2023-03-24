import { signIn, signOut } from "next-auth/react";
import Search from "../search/index";
import styles from "./nav.module.scss";
function Nav({ searchInitialValue, signedIn }) {
  return (
    <div className={styles.navContainer}>
      <div className={styles.navRightContainer}></div>
      <Search initialValue={searchInitialValue} />
      <div className={styles.navLeftContainer}>
        {signedIn ? (
          <button
            onClick={() =>
              signOut({
                redirect: "/",
              })
            }
          >
            Sign Out
          </button>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </div>
    </div>
  );
}

export default Nav;
