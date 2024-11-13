import React, { useState, useEffect } from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MusicArticleItems from "./musicArticleItems";

export interface MyMusicFeedList {
  name: string;
  originSinger: string;
  originTitle: string;
  state: string;
  tuhmbnail: string;
  workspaceSeq: number;
}

const ArticleMusicList: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [myMusicFeedList, setMyMusicFeedList] = useState<MyMusicFeedList[]>([]);

  useEffect(() => {
    const getMusicFeed = async () => {
      const authStorage = localStorage.getItem("auth-storage");
      const storedToken = localStorage.getItem("jwtToken");
      let artistSeq: number | null = null;

      if (authStorage) {
        try {
          const parsedData = JSON.parse(authStorage);
          artistSeq = parsedData?.state?.artistSeq || null;
        } catch (error) {
          console.error("Failed to parse auth-storage:", error);
        }
      }

      if (id !== undefined) {
        artistSeq = parseInt(id);
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

        console.log("어떤 데이터냐", response.data.workspaceDto);
        // 데이터가 배열인지 확인하고 설정
        if (Array.isArray(response.data.workspaceDto)) {
          setMyMusicFeedList(response.data.workspaceDto);
        } else {
          console.warn("Expected an array but received:", response.data);
        }
      } catch (error) {
        console.warn(error);
      }
    };

    getMusicFeed();
  }, [API_URL, id]);

  return (
    <Box marginBottom="200px">
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap="2"
        margin="60px"
        marginLeft="90px"
      >
        {Array.isArray(myMusicFeedList) &&
          myMusicFeedList.map((myMusic, index) => (
            <GridItem key={index}>
              <MusicArticleItems myMusic={myMusic} />
            </GridItem>
          ))}
      </Grid>
    </Box>
  );
};

export default ArticleMusicList;
