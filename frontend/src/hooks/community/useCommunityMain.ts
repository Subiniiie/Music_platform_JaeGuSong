import React, { useState } from "react";
// import { useHeader } from "@/hooks/community/headerContext";

const useCommunityMain = () => {
    const [feedState, setFeedState] = useState<boolean>(true);
    const [ changeHeader, setChangeHeader ] = useState<boolean>(true);
    const [ openSearchModal, setOpenSearchModal ] = useState<boolean>(false);
    const [ searchInput, setSearchInput ] = useState<string>('');
    // const { toggleHeader } = useHeader();

    const API_URL =import.meta.env.VITE_API_URL;

    const goMusicMainFeed = () => {
        setFeedState(false);
    };

    const goMainFeed = () => {
        setFeedState(true);
    };

    const handleChangeHeader = () => {
        setChangeHeader(false);
    }

    const toggleSearchModal = () => {
        setOpenSearchModal((prev) => !prev);
        // toggleHeader
    }

    const handleChangeSearch = (event: React.FormEvent) => {
        event.preventDefault();
        goSearchUserOrCrew(event);
        setSearchInput('');
        console.log(changeHeader);
    }

    const goSearchUserOrCrew = (event: React.FormEvent) => {
        console.log(searchInput)
        // 크루, 유저 정보 받아와서 이름에 searchInput이 포함된 모든 크루, 유저 출력
        // 클릭을 할 피드가 유저인지 크루인지 알기
        handleChangeHeader()
    }

    // 게시물 목록 가져오기
    const getArticleList = async () => {
        // 토큰 가져오기
        // try {
        //   const response = await axios.get(`${API_URL}/api/boards/${userSeq}`),
        //   headers: {
        //     access: `${token}`
        //   },
        // } catch(error) {
        //   console.error(error)
        // }
      };

    return {
        feedState,
        changeHeader,
        openSearchModal,
        searchInput,
        goMusicMainFeed,
        goMainFeed,
        handleChangeHeader,
        toggleSearchModal,
        handleChangeSearch,
        setSearchInput,
        getArticleList
        
    };
};

export default useCommunityMain;