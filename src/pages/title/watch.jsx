import React, { useRef } from "react";

import nodeFetch from "node-fetch";

import dynamic from "next/dynamic";
// fix the below import
import {
  makeProviders,
  makeSimpleProxyFetcher,
  makeStandardFetcher,
  targets,
} from "@movie-web/providers";

const ShakaVideoPlayer = dynamic(import("../../components/videoPlayer"), {
  ssr: false,
});

function Watch({ url, videoUrls }) {
  const iframe = useRef(null);
  if (!url && !videoUrls) {
    return <h1>Something went wrong!</h1>;
  }
  return (
    <div style={{ height: "100vh", width: "100vw", overflowY: "hidden" }}>
      {!videoUrls ? (
        <iframe
          allow="self autoplay"
          allowFullScreen
          ref={iframe}
          style={{
            height: "100%",
            width: "100%",
            margin: 0,
            overflow: "hidden",
            border: "none",
          }}
          src={url}
          name="self"
        ></iframe>
      ) : (
        <ShakaVideoPlayer sources={videoUrls.qualities} />
      )}
    </div>
  );
}

export async function getServerSideProps(req) {
  const id = req.query.id;
  const media_type = req.query.media_type;
  const year = req.query.year;
  const title = req.query.title;
  const season = req.query.s ?? 1;
  const episode = req.query.e ?? 1;
  // const embedUrl =
  //   "https://2embed.cc/embed/" +
  //   id +
  //   (media_type === "tv" ? `?s=${season}&e=${episode}` : "");

  // const embedUrl =
  //   `https://vidsrc.to/embed/${media_type}/${id}` +
  //   (media_type === "tv" ? `?s=${season}&e=${episode}` : "");

  // const embed_page = await TwoEmbed.getEmbedPageSrc(media_type, {
  //   id,
  //   season,
  //   episode,
  // });

  // const sources = await TwoEmbed.extract_content(embed_page);
  // console.log(sources);

  const myFetcher = makeSimpleProxyFetcher(
    "https://simple-proxy.dineshgautam5252.workers.dev/",
    nodeFetch
  );
  console.log(nodeFetch);
  // make an instance of the providers library
  const providers = makeProviders({
    fetcher: makeStandardFetcher(nodeFetch),
    // proxiedFetcher: myFetcher,
    // will be played on a native video player
    target: targets.ALL,
  });
  const media = {
    title,
    type: media_type,
    releaseYear: year,
    tmdbId: id,
  };
  // const sources = providers.listSources();
  // const embeds = providers.listEmbeds();

  console.log("loading..");
  // console.log(media);
  // const sourcePromises = sources.map(async (source) =>
  //   providers
  //     .runSourceScraper({
  //       id: source.id,
  //       media,
  //     })
  //     .then((e) => console.log("success"))
  //     .catch((e) => console.log("error"))
  // );
  const data = null;
  // const data = await providers.runAll({
  //   media: media,
  //   events: {
  //     init(evt) {
  //       console.log("init");
  //       console.log(evt);
  //     },
  //     start(id) {
  //       console.log("start");
  //       console.log(id);
  //     },
  //     update(evt) {
  //       console.log("update");
  //       console.log(evt);
  //     },
  //     discoverEmbeds(evt) {
  //       console.log("discoverEmbeds");
  //       console.log(evt);
  //     },
  //   },
  // });
  console.log("loading done..");
  // const data = null;
  console.log(data);
  return {
    props: {
      // url: embedUrl,
      videoUrls: data?.stream || "false",
      // videoUrls: data?.stream || null,
    },
  };
}

export default Watch;
