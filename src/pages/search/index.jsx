import SearchResult from "../../components/SearchResult";
import { getGenre } from "../../tmdbapi/tmdbApi";
import { tmdbSearch } from "@/helpers/api/search/tmdb";
import { ContextProvider } from "@/context/stateContext";
import Nav from "@/components/nav";
import { getSession } from "next-auth/react";

function SearchResultDetailed({ query, result, isSignedIn }) {
  return (
    <ContextProvider>
      {query ? (
        <div>
          <Nav signedIn={isSignedIn} searchInitialValue={query} />
          {result && result.length ? (
            <SearchResult results={result} />
          ) : (
            <h1
              style={{
                width: "fit-content",
                margin: "auto",
                padding: "2rem",
                color: "white",
                opacity: 0.5,
              }}
            >
              No Movies or Tv Shows Found
            </h1>
          )}
        </div>
      ) : (
        <div>
          <Nav signedIn={isSignedIn} />
          <h1
            style={{
              width: "fit-content",
              margin: "auto",
              padding: "2rem",
              color: "white",
              opacity: 0.5,
            }}
          >
            Search your favorite movie or Tv series
          </h1>
        </div>
      )}
    </ContextProvider>
  );
}

export async function getServerSideProps(context) {
  const query = context.query.q;
  const session = await getSession(context);
  if (!query) {
    return {
      props: {},
    };
  }
  const genre = await getGenre();
  const searchResult = await tmdbSearch({ q: query, type: "detailed" });
  const mappedResults = searchResult.map((res) => {
    return {
      ...res,
      genre_ids: res.genre_ids.map((id) => genre.find((gen) => gen.id === id)),
    };
  });
  return {
    props: {
      isSignedIn: !!session,
      query,
      result: mappedResults,
    },
  };
}

export default SearchResultDetailed;
