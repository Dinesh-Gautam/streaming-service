import TitleView from "@/components/Title";
import { ContextProvider } from "@/context/stateContext";
import { getOriginalMovieDetails } from "@/helpers/api/data/movie";
import { getDetails } from "@/tmdbapi/tmdbApi";
import React from "react";

function Title({ result, layout_type, original }) {
  return (
    <ContextProvider>
      <TitleView
        result={result}
        layout_type={layout_type}
        original={original}
      />
    </ContextProvider>
  );
}
export async function getServerSideProps(context) {
  const id = context.query.id;

  const media_type = context.query.type;
  const layout_type = context.query.t || null;
  const original = context.query.original === "true";
  if (!id) {
    context.res.statusCode = 403;
    context.res.write("<h1>No id provided</h1>");
    context.res.end();
  }

  if (!media_type) {
    context.res.statusCode = 403;
    context.res.write("<h1>No Title parameter provided</h1>");
    context.res.end();
  }

  if (media_type && id) {
    let searchResult;
    if (!original) {
      searchResult =
        (await getDetails(id, media_type, { type: media_type })) || null;
      searchResult.seasonInfo = await getDetails(id, media_type, {
        type: "season",
      });
    } else {
      searchResult = getOriginalMovieDetails(id);
    }
    return {
      props: {
        result: searchResult,
        layout_type,
        original: Boolean(original),
      },
    };
  }

  return {
    props: {
      result: {},
    },
  };
}

export default Title;
