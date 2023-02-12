import { getMovieData } from "@/helpers/api/data/movie";
import React from "react";
import dynamic from "next/dynamic";
const ShakaVideoPlayer = dynamic(import("../../components/videoPlayer"), {
  ssr: false,
});

function index({ videoSrc }) {
  return (
    <>
      {!videoSrc ? (
        <h1> Some went wrong!</h1>
      ) : (
        <ShakaVideoPlayer manifestUrl={videoSrc} />
      )}
    </>
  );
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
    // redirect: {
    //   destination:
    //     "/api/play/" + movieData.videoFileDir + "/" + movieData.videoFileName,
    // },
    props: {
      videoSrc:
        "/api/play/" + movieData.videoFileDir + "/" + movieData.videoFileName,
    },
  };
}

export default index;
