import { signOut, useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Search from "../../components/search/search";
import { ContextProvider } from "../../context/stateContext";
import { redirectIfUserIsNotAuthenticated } from "../../helpers/redirect";

function MainHome({ session }) {
  return (
    <ContextProvider>
      <div>
        <Nav />
        <div>This is home</div>
      </div>
    </ContextProvider>
  );
}
function Nav() {
  return (
    <>
      <Search />
      <button
        onClick={() =>
          signOut({
            redirect: "/",
          })
        }
      >
        Sign Out
      </button>
    </>
  );
}
export async function getServerSideProps(context) {
  return redirectIfUserIsNotAuthenticated({ context, path: "/" });
}

export default MainHome;
