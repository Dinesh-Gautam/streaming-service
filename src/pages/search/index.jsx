import SearchResult from "../../components/SearchResult";
import { getGenre, searchSuggest } from "../../tmdbapi/tmdbApi";
import Search from "../../components/Search";
import { tmdbSearch } from "@/helpers/api/search/tmdb";
import { ContextProvider } from "@/context/stateContext";
import Nav from "@/components/nav";

function SearchResultDetailed({ query, result }) {
  return (
    <ContextProvider>
    <div>
      <Nav searchInitialValue={query} />
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
    </ContextProvider>
  );
}

export async function getServerSideProps(context) {
  const query = context.query.q;
  const genre = await getGenre();
  const searchResult = await tmdbSearch({ q : query, type: "detailed" });
  const mappedResults = searchResult.map((res) => {
    return {
      ...res,
      genre_ids: res.genre_ids.map((id) => genre.find((gen) => gen.id === id)),
    };
  });
  return {
    props: {
      query,
      result: mappedResults,
    },
  };
}

export default SearchResultDetailed;
