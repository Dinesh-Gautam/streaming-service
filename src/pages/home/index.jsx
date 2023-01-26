import { signOut, useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { redirectIfUserIsNotAuthenticated } from "../../helpers/redirect";

function MainHome({ session }) {
  return (
    <div>
      <Nav /> This is home
    </div>
  );
}
function Nav() {
  return (
    <button
      onClick={() =>
        signOut({
          redirect: "/",
        })
      }
    >
      Sign Out
    </button>
  );
}
export async function getServerSideProps(context) {
  return redirectIfUserIsNotAuthenticated({ context, path: "/" });
}

export default MainHome;
