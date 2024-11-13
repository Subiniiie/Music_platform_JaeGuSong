import React, { useEffect, useState } from "react";
import { Box, Text, Image, Button, Stack, Flex } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import useCommunityMain from "@/hooks/community/useCommunityMain";
import paths from "@/configs/paths";

const ArticleList: React.FC = () => {
  const authStorage = localStorage.getItem("auth-storage");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { myFeedArticleItems, getArticleList } = useCommunityMain();
  const [filter, setFilter] = useState<string>("ALL");
  let artistSeq: number | null = null;

  if (authStorage) {
    try {
      const parsedData = JSON.parse(authStorage);
      artistSeq = parsedData?.state?.artistSeq || null;
    } catch (error) {
      console.error("Failed to parse auth-storage:", error);
    }
  }

  useEffect(() => {
    if (id === undefined && artistSeq !== null) {
      getArticleList(artistSeq);
    } else if (id !== undefined) {
      getArticleList(parseInt(id));
    }
  }, [artistSeq]);

  const goDetail = (boardSeq: number) => {
    navigate(paths.community.detail(boardSeq));
  };

  const filteredArticles =
    myFeedArticleItems?.flat().filter((article) => {
      if (filter === "ALL") return true;
      return article.state === filter;
    }) || [];

  const totalArticles = filteredArticles.length;

  return (
    <Box height="800px" overflowY="auto" marginBottom="100px" padding="10px">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        marginBottom="20px"
        padding="10px"
      >
        <Text fontSize="xl" fontWeight="bold" color="white">
          총 게시물: {totalArticles}
        </Text>
        <Stack direction="row" spacing={4}>
          <Button
            colorScheme={filter === "ALL" ? "blue" : "gray"}
            onClick={() => setFilter("ALL")}
            _hover={{ backgroundColor: "gray", color: "black" }}
          >
            전체 보기
          </Button>
          <Button
            colorScheme={filter === "PUBLIC" ? "blue" : "gray"}
            onClick={() => setFilter("PUBLIC")}
            _hover={{ backgroundColor: "gray", color: "black" }}
          >
            공개
          </Button>
          <Button
            colorScheme={filter === "PRIVATE" ? "blue" : "gray"}
            onClick={() => setFilter("PRIVATE")}
            _hover={{ backgroundColor: "gray", color: "black" }}
          >
            비공개
          </Button>
        </Stack>
      </Flex>

      {filteredArticles.length > 0 ? (
        filteredArticles.map((myFeedArticleItem, index) => (
          <Box
            key={index}
            cursor="pointer"
            onClick={() => goDetail(myFeedArticleItem.seq)}
            borderRadius="15px"
            background="#1c1b3f"
            margin="30px 30px"
            height="160px"
            display="flex"
            flexDirection="row"
            alignItems="center"
            padding="10px 40px"
            transition="transform 0.2s, box-shadow 0.2s"
            _hover={{
              transform: "scale(1.02)",
              border: "2px solid #4e4b7e",
            }}
          >
            <Image
              src="/assets/musicIcon.png"
              boxSize="60px"
              marginRight="15px"
            />
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              flex="1"
              paddingLeft="20px"
            >
              <Text textStyle="2xl" fontWeight="bold" color="white" flex="1">
                {myFeedArticleItem.title}
              </Text>
              <Box
                background={
                  myFeedArticleItem.state === "PUBLIC" ? "#4682B4" : "#FF4500"
                }
                color="white"
                fontSize="sm"
                fontWeight="medium"
                borderRadius="12px"
                padding="5px 10px"
                marginLeft="15px"
              >
                {myFeedArticleItem.state}
              </Box>
            </Box>
          </Box>
        ))
      ) : (
        <Box marginTop="20px" marginLeft="20px">
          <Text>게시물이 없습니다.</Text>
        </Box>
      )}
    </Box>
  );
};

export default ArticleList;
