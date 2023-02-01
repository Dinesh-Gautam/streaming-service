import { getMovieData } from "@/helpers/api/data/movie";
import React from "react";

function index() {
  return <div>index</div>;
}

export async function getServerSideProps(context) {
  const uid = context.query.id;
  if (!uid) {
    return {
      props: {},
    };
  }
  const movieData = getMovieData(uid);

  return {
    redirect: {
      destination:
        "/api/play/" + movieData.videoFileDir + "/" + movieData.videoFileName,
    },
    props: {},
  };
}

export default index;
