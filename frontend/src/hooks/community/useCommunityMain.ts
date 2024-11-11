import React, { useState } from "react";
import axios from "axios";
import { ArticleItem } from "@/configs/community/articleItem";

const useCommunityMain = () => {
    const [feedState, setFeedState] = useState<boolean>(true);
    const [ changeHeader, setChangeHeader ] = useState<boolean>(true);
    const [ myFeedArticleItems, setMyFeedArticleItems ] = useState<ArticleItem[]>([]);


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

    // 게시물 목록 가져오기
    const getArticleList = async (artistSeq: Number) => {
        const storedToken = localStorage.getItem('jwtToken');

        if (!storedToken || artistSeq === null) {
            console.error('No token or invalid artistSeq');
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/api/boards/artists/${artistSeq}`,
            {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                },
            })
        setMyFeedArticleItems([response.data]);
        } catch(error) {
          console.error(error)
        }

    }

   

    return {
        feedState,
        changeHeader,
        myFeedArticleItems,
        goMusicMainFeed,
        goMainFeed,
        handleChangeHeader,
        getArticleList
    };
};

export default useCommunityMain;