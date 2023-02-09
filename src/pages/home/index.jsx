import HomePageSliders from "@/components/home/slider/HomePageSlider";
import { getPublishedMovies } from "@/helpers/api/data/movie";
import Link from "next/link";
import React from "react";
import Banner from "../../components/home/banner";
import Nav from "../../components/nav";
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
        <HomePageSliders popularMovies={popularMovies} />
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
