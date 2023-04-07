import { getSession } from "next-auth/react";
import React from "react";
import Banner from "../../components/home/banner";
import Nav from "../../components/nav";
import HomePageSliders from "@/components/home/slider/HomePageSlider";
import { ContextProvider } from "../../context/stateContext";
import { getPublishedMovies } from "@/helpers/api/data/movie";
import { getPopularMovies } from "../../helpers/api/search/tmdb";

function MainHome(props) {
  return (
    <ContextProvider>
      <div>
        <Nav signedIn={props.signedIn} />
        {/* {props.popularMovies && <Banner popularMovies={props.popularMovies} />} */}
        <HomePageSliders {...props} />
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

  const originalMovies = await getPublishedMovies();
  const session = await getSession(context);
  return {
    props: {
      signedIn: !!session,
      popularMovies,
      originalMovies,
      nowPlaying,
      trendingMovies,
      trendingTv,
    },
  };
}

export default MainHome;
