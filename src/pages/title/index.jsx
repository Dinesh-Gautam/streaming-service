import TitleView from "@/components/Title";
import { getDetails } from "@/tmdbapi/tmdbApi";
import React from "react";

function Title({ result }) {
  return <TitleView result={result} />;
}
export async function getServerSideProps(context) {
  const id = context.query.id;

  const media_type = context.query.type;
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
    const searchResult = await getDetails(id, media_type);
    return {
      props: {
        result: searchResult,
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
