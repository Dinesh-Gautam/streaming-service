import HomePageSliders from "@/components/home/slider/HomePageSlider";
import { getPublishedMovies } from "@/helpers/api/data/movie";
import Link from "next/link";
import React from "react";
import Banner from "../../components/home/banner";
import Nav from "../../components/nav";
import { ContextProvider } from "../../context/stateContext";
import { getPopularMovies } from "../../helpers/api/search/tmdb";
import { redirectIfUserIsNotAuthenticated } from "../../helpers/redirect";

function MainHome({
  session,
  popularMovies,
  movies,
  nowPlaying,
  trendingMovies,
  trendingTv,
}) {
  return (
    <ContextProvider>
      <div>
        <Nav />
        {popularMovies && <Banner popularMovies={popularMovies.results} />}
        {/* {movies && (
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
        )} */}
        <HomePageSliders
          popularMovies={popularMovies}
          originalMovies={movies}
          nowPlaying={nowPlaying}
          trendingMovies={trendingMovies}
          trendingTv={trendingTv}
        />
      </div>
    </ContextProvider>
  );
}

export async function getServerSideProps(context) {
  const [popularMovies, nowPlaying, trendingMovies, trendingTv] =
    await Promise.all([
      getPopularMovies(),
      getPopularMovies("movie", "now_playing"),
      getPopularMovies("trending", "movie", "week"),
      getPopularMovies("trending", "tv", "week"),
    ]);

  const movies = getPublishedMovies();
  return redirectIfUserIsNotAuthenticated({
    context,
    path: "/",
    props: {
      popularMovies,
      movies,
      nowPlaying,
      trendingMovies,
      trendingTv,
    },
  });
}

export default MainHome;
