import React, { useEffect, useRef } from "react";

function Watch({ url }) {
  const iframe = useRef(null);

  useEffect(() => {
    if (!iframe.current) return;
    console.log(iframe.current);
  }, [iframe.current]);

  return (
    <div style={{ height: "100vh", width: "100vw", overflowY: "hidden" }}>
      <iframe
        ref={iframe}
        style={{
          height: "100%",
          width: "100%",
          margin: 0,
          overflow: "hidden",
        }}
        src={url}
        frameborder="0"
      ></iframe>
    </div>
  );
}

export async function getServerSideProps(req) {
  const id = req.query.id;
  const media_type = req.query.media_type;
  const season = req.query.s ?? 1;
  const episode = req.query.episode ?? 1;
  const embedUrl =
    "https://www.2embed.to/embed/tmdb/" +
    media_type +
    "/?id=" +
    id +
    (media_type === "tv" ? `&s=${season}&e=${episode}` : "");

  return {
    props: {
      url: embedUrl,
    },
  };
}

export default Watch;
