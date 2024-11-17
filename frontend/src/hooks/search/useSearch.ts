import { useState } from "react";
import axios from "axios";
import paths from "@/configs/paths";
import { useNavigate } from "react-router-dom";
import useHeaderStore from "@/stores/headerStore";

interface SearchResult {
  email: string;
  nickname: string;
  position: string;
  profileImage: string;
  seq: number; // artistSeq 값
}

export default function useSearch() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [runSearch, setRunSearch] = useState<boolean>(false);

  const { setOtherUserNickname, setOtherUserProfileImage } = useHeaderStore();

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const toggleSearch = () => {
    setRunSearch(false);
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

  const handleSearchSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("jwtToken");
    setRunSearch(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/artists/${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setSearchResults([response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const goOtherFeed = async (
    artistSeq: number,
    otherNickname: string,
    otherProfileImage: string
  ) => {
    setOtherUserNickname(otherNickname);
    setOtherUserProfileImage(otherProfileImage);

    console.log('나 다른 사람 꺼 보러 간다', artistSeq, otherNickname, otherProfileImage)

    // artistSeq를 URL에 포함해 전달
    navigate(paths.community.generalCommunity(artistSeq), {
      state: { artistSeq, otherNickname, otherProfileImage },
    });
  };

  return {
    isSearchActive,
    isVisible,
    searchQuery,
    searchResults,
    runSearch,
    goOtherFeed,
    toggleSearch,
    handleSearchChange,
    handleSearchSubmit,
  };
}
