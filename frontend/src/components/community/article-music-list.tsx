import React, { useState, useEffect } from "react";
import { Box, Grid, GridItem, Flex, Button, Stack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MusicArticleItems from "./musicArticleItems";
import { useMusicFeedStore } from "@/stores/musicListStore";

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
  const { setMyMusicFeedList, myMusicFeedList } = useMusicFeedStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("ALL");

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
  }, [API_URL, id, setMyMusicFeedList]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Box color="red">{error}</Box>;
  }

  const authStorage = localStorage.getItem("auth-storage");
  let loggedInArtistSeq: number | null = null;

  if (authStorage) {
    try {
      const parsedData = JSON.parse(authStorage);
      loggedInArtistSeq = parsedData?.state?.artistSeq || null;
    } catch (error) {
      console.error("Failed to parse auth-storage:", error);
    }
  }

  const isOwner = id === undefined || parseInt(id) === loggedInArtistSeq;

  const filteredMusicFeedList = myMusicFeedList.filter((myMusic) => {
    if (isOwner) {
      // 자신인 경우 필터에 따라 표시
      if (filter === "ALL") return true;
      return myMusic.state === filter;
    } else {
      // 다른 사람인 경우 PUBLIC만 표시
      return myMusic.state === "PUBLIC";
    }
  });

  return (
    <Box
      maxHeight="600px"
      overflowY="auto"
      padding="10px"
      css={{
        "&::-webkit-scrollbar": {
          width: "10px",
          height: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          borderRadius: "5px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      {isOwner && (
        <Flex justifyContent="flex-end" alignItems="center" marginBottom="20px">
          <Stack
            direction="row"
            spacing={4}
            marginRight="18px"
            marginTop="10px"
          >
            <Button
              colorScheme={filter === "ALL" ? "blue" : "gray"}
              onClick={() => setFilter("ALL")}
              _hover={{
                backgroundColor: "blue.600",
                color: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              fontWeight="bold"
              borderRadius="full"
              paddingX="20px"
              paddingY="8px"
              backgroundColor={filter === "ALL" ? "#1E90FF" : "gray.500"}
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
              transition="all 0.3s ease-in-out"
            >
              전체 보기
            </Button>
            <Button
              colorScheme={filter === "PUBLIC" ? "blue" : "gray"}
              onClick={() => setFilter("PUBLIC")}
              _hover={{
                backgroundColor: "#1E90FF",
                color: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              fontWeight="bold"
              borderRadius="full"
              paddingX="20px"
              paddingY="8px"
              backgroundColor={filter === "PUBLIC" ? "#1E90FF" : "gray.500"}
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
              transition="all 0.3s ease-in-out"
            >
              공개
            </Button>
            <Button
              colorScheme={filter === "PRIVATE" ? "red" : "gray"}
              onClick={() => setFilter("PRIVATE")}
              _hover={{
                backgroundColor: "#FF6347",
                color: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              fontWeight="bold"
              borderRadius="full"
              paddingX="20px"
              paddingY="8px"
              backgroundColor={filter === "PRIVATE" ? "#FF6347" : "gray.500"}
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
              transition="all 0.3s ease-in-out"
            >
              비공개
            </Button>
          </Stack>
        </Flex>
      )}
      <Grid templateColumns="repeat(3, 1fr)" gap="4">
        {filteredMusicFeedList.map((myMusic, index) => (
          <GridItem key={index}>
            <MusicArticleItems myMusic={myMusic} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default ArticleMusicList;
