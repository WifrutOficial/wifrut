
import React, { createContext, useContext, useState } from "react";


const SearchContext = createContext();


export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  //analizar esta funcion si sirve o no!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, updateSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};


export const useSearch = () => {
  return useContext(SearchContext);
};
