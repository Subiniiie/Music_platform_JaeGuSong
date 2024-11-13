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
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 상태
  const itemsPerPage = 8; // 페이지당 표시할 게시물 수
  const [totalPage, setTotalPage] = useState<number>(1); // 전체 페이지 수
  let artistSeq: number | null = null;

  if (authStorage) {
    try {
      const parsedData = JSON.parse(authStorage);
      artistSeq = parsedData?.state?.artistSeq || null;
    } catch (error) {
      console.error("Failed to parse auth-storage:", error);
    }
  };

  useEffect(() => {
    if (id === undefined) {
      if (artistSeq !== null) {
        getArticleList(artistSeq);
      }
    } else if (id !== undefined) {
      getArticleList(parseInt(id));
    }
  }, [artistSeq]);

  const goDetail = (boardSeq: number) => {
    navigate(paths.community.detail(boardSeq));
  };

  useEffect(() => {
    // 페이지네이션을 위한 총 페이지 수 계산
    setTotalPage(Math.ceil(filteredArticles.length / itemsPerPage));
  }, [myFeedArticleItems, filter]);

  const filteredArticles = myFeedArticleItems
    ?.flat()
    .filter((article) => {
      if (filter === "ALL") return true;
      return article.state === filter;
    }) || [];

  // 현재 페이지에 해당하는 게시물만 slice
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
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
        }}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          marginBottom="20px"
          padding="10px"
        >
          <Text fontSize="xl" fontWeight="bold" color="white">
            총 피드 {filteredArticles.length}개
          </Text>
          <Stack direction="row" spacing={4}>
            <Button
              colorScheme={filter === "ALL" ? "blue" : "gray"}
              onClick={() => setFilter("ALL")}
              _hover={{
                backgroundColor: "blue.600", 
                color: "white", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
              fontWeight="bold"
              borderRadius="full"
              paddingX="20px"
              paddingY="8px"
              backgroundColor={filter === "ALL" ? "#1E90FF" : "gray.500"} // 활성화된 버튼 색상 변경
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)" // 기본 그림자 효과
              transition="all 0.3s ease-in-out" // 부드러운 전환 효과
            >
              전체 보기
            </Button>
            <Button
              colorScheme={filter === "PUBLIC" ? "blue" : "gray"}
              onClick={() => setFilter("PUBLIC")}
              _hover={{
                backgroundColor: "#1E90FF", 
                color: "white", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
              fontWeight="bold"
              borderRadius="full"
              paddingX="20px"
              paddingY="8px"
              backgroundColor={filter === "PUBLIC" ? "#1E90FF" : "gray.500"} // 활성화된 버튼 색상 변경
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)" // 기본 그림자 효과
              transition="all 0.3s ease-in-out" // 부드러운 전환 효과
            >
              공개
            </Button>
            <Button
              colorScheme={filter === "PRIVATE" ? "red" : "gray"}
              onClick={() => setFilter("PRIVATE")}
              _hover={{
                backgroundColor: "#FF6347", 
                color: "white", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
              fontWeight="bold"
              borderRadius="full"
              paddingX="20px"
              paddingY="8px"
              backgroundColor={filter === "PRIVATE" ? "#FF6347" : "gray.500"} // 활성화된 버튼 색상 변경
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)" // 기본 그림자 효과
              transition="all 0.3s ease-in-out" // 부드러운 전환 효과
            >
              비공개
            </Button>
          </Stack>
        </Flex>
        <Flex
          wrap="wrap"
          justifyContent="center"
        >
          {paginatedArticles.length > 0 ? (
            paginatedArticles.map((myFeedArticleItem, index) => (
              <Box
                key={index}
                cursor="pointer"
                onClick={() => goDetail(myFeedArticleItem.seq)}
                borderRadius="15px"
                background="linear-gradient(145deg, #1a1a2e, #1c1b3f)" // 그라데이션 배경
                margin="20px 20px"
                width="45%" // 한 줄에 두 개씩 보이도록 조정
                height="180px"
                display="flex"
                flexDirection="row"
                alignItems="center"
                padding="10px 20px"
                transition="transform 0.3s, box-shadow 0.3s ease-in-out"
                boxShadow="0 10px 20px rgba(0, 0, 0, 0.3)" // 그림자 효과 추가
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.5)", // 호버 시 더 강한 그림자
                  border: "2px solid #6a4bff", // 보라색 포인트
                }}
              >
                <Image
                  src="/assets/musicIcon.png"
                  boxSize="70px"
                  marginRight="20px"
                  borderRadius="50%" // 원형 이미지
                  boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)" // 이미지에 그림자 추가
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  flex="1"
                  paddingLeft="20px"
                  position="relative" // 상태 바가 항상 보이도록 하기 위해 부모 Box에 추가
                >
                  <Text fontSize="lg" fontWeight="bold" color="white" mb="5px">
                    {myFeedArticleItem.title}
                  </Text>
                  <Box
                    position="absolute"
                    top="10px"
                    right="10px"
                    background={myFeedArticleItem.state === "PUBLIC" ? "#4682B4" : "#FF6347"}
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

      {/* CommunityPagination 컴포넌트 추가 */}
      <CommunityPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPage}
      />
    </>
  );
};

export default ArticleList;
