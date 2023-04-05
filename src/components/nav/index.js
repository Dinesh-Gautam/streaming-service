import { signIn, signOut, useSession } from "next-auth/react";
import Search from "../search/index";
import styles from "./nav.module.scss";
import Avatar from "@mui/joy/Avatar";
import { useState } from "react";
import { Logout } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
function Nav({ searchInitialValue, signedIn }) {
  const [open, setOpen] = useState(false);
  const user = useSession().data;

  return (
    <div className={styles.navContainer}>
      <div className={styles.navRightContainer}></div>
      <Search initialValue={searchInitialValue} />
      <div className={styles.navLeftContainer}>
        {signedIn ? (
          <>
            <button
              onBlur={() => {
                setOpen(false);
              }}
              onClick={() =>
                // signOut({
                //   redirect: "/",
                // })
                setOpen((prev) => !prev)
              }
            >
              {/* Sign Out */}
              <Avatar />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className={styles.userModalContainer}
                >
                  {user && (
                    <div className={styles.userInfo}>
                      <h6>{user.user.name}</h6>
                      <span>{user.user.email}</span>
                    </div>
                  )}
                  <div className={styles.buttonsContainer}>
                    {user.role === "admin" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          signOut();
                        }}
                      >
                        <span>Admin</span>
                        <Logout />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        signOut();
                      }}
                    >
                      <span>Sign Out</span>
                      <Logout />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <button className={styles.normalButton} onClick={() => signIn()}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default Nav;
