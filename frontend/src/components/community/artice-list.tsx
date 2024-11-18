import React, { useEffect, useState } from "react";
import { Box, Text, Image, Button, Stack, Flex } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import useCommunityMain from "@/hooks/community/useCommunityMain";
import paths from "@/configs/paths";
import CommunityPagination from "./communityPagination";

const ArticleList: React.FC = () => {
  const authStorage = localStorage.getItem("auth-storage");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { myFeedArticleItems, getArticleList } = useCommunityMain();
  const [filter, setFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const [totalPage, setTotalPage] = useState<number>(1);
  let artistSeq: number | null = null;

  // authStorage에서 artistSeq 가져오기
  if (authStorage) {
    try {
      const parsedData = JSON.parse(authStorage);
      artistSeq = parsedData?.state?.artistSeq || null;
    } catch (error) {
      console.error("Failed to parse auth-storage:", error);
    }
  }

  // 게시물 가져오기
  useEffect(() => {
    if (id === undefined) {
      if (artistSeq !== null) {
        getArticleList(artistSeq);
      }
    } else if (id !== undefined) {
      getArticleList(parseInt(id));
    }
  }, [artistSeq]);

  // 페이지네이션 총 페이지 수 계산
  useEffect(() => {
    setTotalPage(Math.ceil(filteredArticles.length / itemsPerPage));
  }, [myFeedArticleItems, filter]);

  const filteredArticles =
    myFeedArticleItems?.flat().filter((article) => {
      if (filter === "ALL") return true;
      return article.state === filter;
    }) || [];

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goDetail = (boardSeq: number) => {
    navigate(paths.community.detail(boardSeq));
  };

  // 버튼을 "나의 커뮤니티"에서만 보여주기 위한 조건
  const isMyCommunity = id === undefined && artistSeq !== null;

  return (
    <>
      <Box
        maxHeight="600px"
        overflowY="auto"
        padding="10px"
        marginBottom="20px"
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
        {isMyCommunity && (
          <Flex
            justifyContent="flex-end"
            alignItems="center"
            marginBottom="20px"
            // padding="10px"
          >
            <Stack direction="row" spacing={4}>
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

        <Flex wrap="wrap" justifyContent="center">
          {paginatedArticles.length > 0 ? (
            paginatedArticles.map((myFeedArticleItem, index) => (
              <Box
                key={index}
                cursor="pointer"
                onClick={() => goDetail(myFeedArticleItem.seq)}
                borderRadius="15px"
                background="linear-gradient(145deg, #1a1a2e, #1c1b3f)"
                margin="20px 20px"
                width="45%"
                height="180px"
                display="flex"
                flexDirection="row"
                alignItems="center"
                padding="10px 20px"
                transition="transform 0.3s, box-shadow 0.3s ease-in-out"
                boxShadow="0 10px 20px rgba(0, 0, 0, 0.3)"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.5)",
                  border: "2px solid #6a4bff",
                }}
              >
                <Image
                  src="/assets/musicIcon.png"
                  boxSize="70px"
                  marginRight="20px"
                  borderRadius="50%"
                  boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  flex="1"
                  paddingLeft="20px"
                  position="relative"
                >
                  <Text fontSize="lg" fontWeight="bold" color="white" mb="5px">
                    {myFeedArticleItem.title}
                  </Text>
                  <Box
                    position="absolute"
                    top="10px"
                    right="10px"
                    background={
                      myFeedArticleItem.state === "PUBLIC"
                        ? "#4682B4"
                        : "#FF6347"
                    }
                    color="white"
                    fontSize="xs"
                    fontWeight="medium"
                    borderRadius="20px"
                    padding="6px 12px"
                    boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
                  >
                    {myFeedArticleItem.state}
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Box marginTop="20px" marginLeft="20px">
              <Text color="gray.400">게시물이 없습니다.</Text>
            </Box>
          )}
        </Flex>
      </Box>

      <CommunityPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPage}
      />
    </>
  );
};

export default ArticleList;
