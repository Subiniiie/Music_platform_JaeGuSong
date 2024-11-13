import React, { useState, useEffect } from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MusicArticleItems from "./musicArticleItems";
import CommunityPagination from "./communityPagination";

export interface MyMusicFeedList {
  name: string;
  originSinger: string;
  originTitle: string;
  state: string;
  thumbnail: string;
  workspaceSeq: number;
}

const ArticleMusicList: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [myMusicFeedList, setMyMusicFeedList] = useState<MyMusicFeedList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 상태
  const itemsPerPage = 8; // 페이지당 표시할 게시물 수
  const [totalPage, setTotalPage] = useState<number>(1); // 전체 페이지 수


  useEffect(() => {
    const getMusicFeed = async () => {
      setLoading(true);
      const authStorage = localStorage.getItem("auth-storage");
      const storedToken = localStorage.getItem("jwtToken");
      let artistSeq: number | null = null;

      if (authStorage) {
        try {
          const parsedData = JSON.parse(authStorage);
          artistSeq = parsedData?.state?.artistSeq || null;
        } catch (error) {
          console.error("Failed to parse auth-storage:", error);
          setError("Authentication data is corrupted.");
          setLoading(false);
          return;
        }
      }

      // id가 있으면 그 값을 artistSeq로 사용
      if (id !== undefined) {
        artistSeq = parseInt(id);
      }

      if (artistSeq === null) {
        setError("Artist sequence is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/artists/${artistSeq}/workspaces`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        // 데이터가 배열인지 확인하고 설정
        if (Array.isArray(response.data.workspaceDto)) {
          setMyMusicFeedList(response.data.workspaceDto);
        } else {
          console.warn("Expected an array but received:", response.data);
          setError("Failed to fetch valid data.");
        }
      } catch (error) {
        console.warn(error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    getMusicFeed();
  }, [API_URL, id]);
  

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Box color="red">{error}</Box>;
  }

  return (
    <Box 
    maxHeight="460px"
    overflowY="auto"
    padding="10px"
    marginBottom="20px"
    css={{
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#6a4bff", // 보라색 계열
        borderRadius: "20px",
      },
      "&::-webkit-scrollbar-track": {
        background: "#02001F",
        borderRadius: "20px",
      },
    }}>
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap="4"
        margin="60px"
        marginLeft="90px"
      >
        {myMusicFeedList.map((myMusic, index) => (
          <GridItem key={index}>
            <MusicArticleItems myMusic={myMusic} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default ArticleMusicList;
