import Search from "../search";
import styles from "./nav.module.scss";
function Nav() {
  return (
    <div className={styles.navContainer}>
      <div className={styles.navRightContainer}></div>
      <Search />
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
