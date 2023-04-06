import { getMovieData } from "@/helpers/api/data/movie";
import React from "react";
import dynamic from "next/dynamic";
import { redirectIfUserIsNotAuthenticated } from "@/helpers/redirect";
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
  const movieData = await getMovieData(uid);
  const callbackUrl = `${process.env.NEXTAUTH_URL}`;
  return redirectIfUserIsNotAuthenticated({
    context,
    path:
      "/auth/signin?callbackUrl=" +
      encodeURIComponent(callbackUrl + context.resolvedUrl),
    props: {
      videoSrc:
        "/api/play/" + movieData.videoFileDir + "/" + movieData.videoFileName,
    },
  });
  // return {
  //   // redirect: {
  //   //   destination:
  //   //     "/api/play/" + movieData.videoFileDir + "/" + movieData.videoFileName,
  //   // },
  //   props: {
  //     videoSrc:
  //       "/api/play/" + movieData.videoFileDir + "/" + movieData.videoFileName,
  //   },
  // };
}

export default index;
