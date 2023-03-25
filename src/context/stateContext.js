import { createContext, useContext, useReducer, useState } from "react";

const dataContext = createContext({});

export function useData() {
  return useContext(dataContext);
}

function reducer(state, action) {
  function updateState(field, value) {
    return {
      ...state,
      [field]: value === undefined ? { ...action.payload } : value,
    };
  }

  switch (action.type) {
    case "search":
      return updateState("search");
    case "searchSuggestions":
      return updateState("searchSuggestions", action.payload);
  }
}

export function ContextProvider({ children }) {
  const [data, dataDispatch] = useReducer(reducer, {
    search: { value: "" },
    searchSuggestions: null,
  });
  const [videosData, setVideosData] = useState([]);

  const value = {
    data,
    dataDispatch,
    videosData,
    setVideosData,
  };

  return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
}
