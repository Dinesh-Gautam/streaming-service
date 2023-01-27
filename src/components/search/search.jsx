import { useState, useRef, useEffect } from "react";
import styles from "./search.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { useData } from "../../context/stateContext";
import FadeImageOnLoad from "../FadeImageOnLoad";
import Separator from "../Separator";
import { searchSuggest } from "../../tmdbapi/tmdbApi";
import { useViewRedirect } from "../../Utils";

function Search({ manual, initialValue = "" }) {
  const { data, dataDispatch } = useData();
  useEffect(() => {
    dataDispatch({ type: "search", payload: { value: initialValue } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchInputFocus, setSearchInputFocus] = useState(false);
  const searchInterval = useRef(null);
  const router = useRouter();

  function inputHandler(event) {
    const target = event.target;
    const value = target.value;

    dataDispatch({ type: "search", payload: { value: value } });
    if (!value.trim()) {
      dataDispatch({
        type: "searchSuggestions",
        payload: null,
      });
      return;
    }
    clearTimeout(searchInterval.current);

    searchInterval.current = setTimeout(async () => {
      const suggestions = await searchSuggest(data.search.value);
      dataDispatch({
        type: "searchSuggestions",
        payload: suggestions,
      });
    }, 500);
  }
  async function searchButtonHandler(e) {
    e.preventDefault();
    setSearchInputFocus(false);

    dataDispatch({
      type: "searchSuggestions",
      payload: null,
    });

    if (data.search.value && data.search.value !== router.query.q) {
      if (manual) {
        router.push("/manual/search?q=" + data.search.value);
      } else {
        router.push("/search?q=" + data.search.value);
      }
    }
  }

  return (
    <div className={styles.div}>
      <form
        style={{
          transition: "outline 0.05s linear",
          outline: searchInputFocus
            ? "2px solid rgba(255, 255, 255, 0.25)"
            : "0px solid rgba(255, 255, 255,0.25)",
        }}
        onSubmit={searchButtonHandler}
        className={styles.searchContainer}
      >
        <input
          onFocus={() => setSearchInputFocus(true)}
          onBlur={() => setSearchInputFocus(false)}
          value={data.search.value}
          onChange={inputHandler}
          type="text"
          placeholder="Search"
          spellCheck={false}
        />
        <AnimatePresence>
          {data.search.value && (
            <motion.button
              type="button"
              style={{
                padding: "0",
              }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              animate={{
                opacity: 0.5,
              }}
              exit={{ opacity: 0 }}
              onClick={() => {
                dataDispatch({ type: "search", payload: { value: "" } });
                dataDispatch({
                  type: "searchSuggestions",
                  payload: null,
                });
              }}
            >
              <ClearIcon />
            </motion.button>
          )}
        </AnimatePresence>

        <button type="submit">
          <SearchIcon fontSize="medium" />
        </button>
      </form>
      <AnimatePresence>
        {searchInputFocus && data.search.value && data.searchSuggestions && (
          <Suggestions searchSuggestions={data.searchSuggestions} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Suggestions({ searchSuggestions }) {
  const containerRef = useRef(null);
  const onClick = useViewRedirect();
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setHeight(containerRef.current?.offsetHeight || 0);
  }, [searchSuggestions]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { ease: "easeOut", delay: 0.2, duration: 0.3 },
      }}
      exit={{
        opacity: 0,
        height: 0,
      }}
      style={{
        height: height,
        transition: `height 0.5s ease-out`,
        cursor: "pointer",
      }}
      className={styles.suggestionContainer}
    >
      <div ref={containerRef}>
        {searchSuggestions.map((suggestion) => {
          return (
            <motion.div
              layout
              transition={{ type: "ease", duration: 0.5 }}
              onClick={onClick(suggestion)}
              className={styles.suggestionResultContainer}
              key={suggestion.id}
            >
              <FadeImageOnLoad
                imageSrc={suggestion.poster_path}
                attr={{
                  imageContainer: {
                    className: styles.suggestionImageContainer,
                  },
                  image: { objectFit: "cover", height: 80, width: 60 },
                }}
              />

              <div className={styles.suggestionInfoContainer}>
                <h4>
                  {suggestion.title ||
                    suggestion.name ||
                    suggestion.original_title ||
                    suggestion.original_name}
                </h4>
                <Separator
                  gap={4}
                  values={[
                    suggestion.media_type,
                    new Date(suggestion.first_air_date).getFullYear(),
                  ]}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default Search;
