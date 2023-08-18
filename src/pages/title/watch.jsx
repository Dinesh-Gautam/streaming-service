import React, { useRef } from "react";

import axios from "axios";
import * as cheerio from "cheerio";
import dynamic from "next/dynamic";

const ShakaVideoPlayer = dynamic(import("../../components/videoPlayer"), {
  ssr: false,
});

function Watch({ url, videoUrls }) {
  const iframe = useRef(null);

  return (
    <div style={{ height: "100vh", width: "100vw", overflowY: "hidden" }}>
      {!videoUrls ? (
        <iframe
          allow="'self'"
          allowFullScreen
          ref={iframe}
          style={{
            height: "100%",
            width: "100%",
            margin: 0,
            overflow: "hidden",
          }}
          src={url}
          name="self"
          framerBorder="0"
        ></iframe>
      ) : (
        <ShakaVideoPlayer manifestUrl={videoUrls[0]} />
      )}
    </div>
  );
}

export async function getServerSideProps(req) {
  const id = req.query.id;
  const media_type = req.query.media_type;
  const season = req.query.s ?? 1;
  const episode = req.query.e ?? 1;
  const embedUrl =
    "https://2embed.cc/embed/" +
    id +
    (media_type === "tv" ? `?s=${season}&e=${episode}` : "");

  const embed_page = await TwoEmbed.getEmbedPageSrc(media_type, {
    id,
    season,
    episode,
  });

  const sources = await TwoEmbed.extract_content(embed_page);
  console.log(sources);

  return {
    props: {
      url: embedUrl,
      videoUrls: sources,
    },
  };
}

export class TwoEmbed {
  static url = "https://www.2embed.cc";

  static isSrc_available(embed_page) {
    if (embed_page !== null) {
      const $ = cheerio.load(embed_page);
      return $("title").text() !== "404 Page Not Found";
    } else {
      return false;
    }
  }

  static list_episodes(library_page, season_n) {
    var $ = cheerio.load(library_page);

    let list_episodes = [];
    let episode_names = [];
    $(".episode-item").each(function (index, element) {
      list_episodes[index] = $(element).attr("data-number");
      episode_names[index] = $(element)
        .text()
        .substring($(element).text().indexOf(":") + 2);
    });

    let sum_total_eps = 0;
    let prev_sum_total_eps = 0;

    let season_details = [];
    var index = 0;
    $(".season-item").each(function (i, el) {
      sum_total_eps += $(`#ss-episodes-${i + 1}`).find("div > div > a").length;
      prev_sum_total_eps += $(`#ss-episodes-${i}`).find("div > div > a").length;

      let season_number = $(el).attr("data-number");
      let episodes_id = list_episodes.slice(prev_sum_total_eps, sum_total_eps);
      let epstotal = episodes_id.length;

      season_details[i] = { season_number, epstotal };

      let episodes = [];

      if (season_n == season_number) {
        episodes_id.forEach((episode_number, index) => {
          const title = episode_names[index + prev_sum_total_eps];
          episodes[index] = { episode_number, title };
        });
        index = i;
        season_details[index] = { episodes, season_number, epstotal };
      }
    });
    if (season_n == "all") {
      return { season_details };
    }
    return season_details[index];
  }
  static async extract_content(embed_page) {
    const $ = cheerio.load(embed_page);

    const source_id = $("#iframesrc").attr("src").toString();

    const rabbitstream_url = await axios
      .get(
        "https://stream.2embed.cc/e/" +
          source_id.replace("/streamsrcs/owns?swid=", ""),
        {
          headers: {
            Referer: "https://www.2embed.cc/",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",

            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "sec-ch-ua":
              '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "iframe",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "cross-site",
            "upgrade-insecure-requests": "1",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        }
      )
      .then((res) => {
        return res.data;
      });
    const urlPattern =
      /jwplayer\("vplayer"\)\.setup\s*\({\s*sources\s*:\s*([\s\S]*?)\s*\,\s*/;

    // Find the URL using the regular expression
    const match = rabbitstream_url.match(urlPattern);
    let urls;
    if (match && match[1]) {
      const extractedUrl = match[1];
      urls = extractedUrl
        .replaceAll('[{file:"', "")
        .replaceAll('"}]', "")
        .split(",");
    }
    if (urls) {
      return urls;
    } else {
      return null;
    }
  }

  static async getEmbedPageSrc(type, { id, season, episode }) {
    try {
      return await axios
        .get(`${TwoEmbed.url}/embed/${id}`, {
          params: {
            id,
            s: season,
            e: episode,
          },
        })
        .then((res) => {
          return res.data;
        });
    } catch (error) {
      return null;
    }
  }
}

export default Watch;
