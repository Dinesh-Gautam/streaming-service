import Slider from "@/components/home/slider/Index";
import { getPublishedMovies } from "@/helpers/api/data/movie";
import { signOut, useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Banner from "../../components/home/banner";
import Nav from "../../components/nav";
import Search from "../../components/search";
import { ContextProvider } from "../../context/stateContext";
import { getPopularMovies } from "../../helpers/api/search/tmdb";
import { redirectIfUserIsNotAuthenticated } from "../../helpers/redirect";

function MainHome({ session, popularMovies, movies }) {
  return (
    <ContextProvider>
      <div>
        <Nav />
        {popularMovies && <Banner popularMovies={popularMovies.results} />}
        {movies && (
          <div>
            <h2>Original Movies</h2>
            <div>
              {movies.map((movie) => (
                <Link key={movie.uid} href={"/movie" + "?id=" + movie.uid}>
                  {movie.title}
                </Link>
              ))}
            </div>
          </div>
        )}
        <Slider data={popularMovies.results} />
      </div>
    </ContextProvider>
  );
}

export async function getServerSideProps(context) {
  const popularMovies = await getPopularMovies();
  const movies = getPublishedMovies();

  return redirectIfUserIsNotAuthenticated({
    context,
    path: "/",
    props: {
      popularMovies,
      movies,
    },
  });
}

export default MainHome;
