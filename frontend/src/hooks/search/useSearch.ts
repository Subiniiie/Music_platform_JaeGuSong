// 여기다가 검색 API 하면 됨.

import { useState } from "react";

export default function useSearch() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSearch = () => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setTimeout(() => setIsVisible(false), 500);
      setSearchQuery("");
    } else {
      setIsVisible(true);
      setSearchQuery("");
      setTimeout(() => setIsSearchActive(true), 0);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return {
    isSearchActive,
    isVisible,
    searchQuery,
    toggleSearch,
    handleSearchChange,
  };
}
