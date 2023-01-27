import { signOut, useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Banner from "../../components/home/banner";
import Nav from "../../components/nav";
import Search from "../../components/search";
import { ContextProvider } from "../../context/stateContext";
import { getPopularMovies } from "../../helpers/api/search/tmdb";
import { redirectIfUserIsNotAuthenticated } from "../../helpers/redirect";

function MainHome({ session, popularMovies }) {
  return (
    <ContextProvider>
      <div>
        <Nav />
        {popularMovies && <Banner popularMovies={popularMovies.results} />}
        <div>This is home</div>
      </div>
    </ContextProvider>
  );
}

export async function getServerSideProps(context) {
  const popularMovies = await getPopularMovies();
  console.log(popularMovies);
  return redirectIfUserIsNotAuthenticated({
    context,
    path: "/",
    props: {
      popularMovies,
    },
  });
}

export default MainHome;
