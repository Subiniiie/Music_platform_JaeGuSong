import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, HStack, Text, Grid } from "@chakra-ui/react";
import {
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import useCommon from "@/hooks/common/common";
import useSearch from "@/hooks/search/useSearch";

const CommunityRecommendUser: React.FC = () => {
  const { API_URL, storeMySeq, storedToken, getMySeq } = useCommon();
  const [recommendedByUsers, setRecommendedByUsers] = useState<any[]>([]);
  console.log(recommendedByUsers);
  const { goOtherFeed } = useSearch();

  useEffect(() => {
    const getRecommentUserByMe = async () => {
      getMySeq();
      if (storeMySeq) {
        try {
          console.log("보낸다", storeMySeq, storedToken);
          const response = await axios.get(
            `${API_URL}/api/recommend/${storeMySeq}/initial`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );
          console.log(" 유저 기반으로 추천받은 데이터", response.data);
          if (Array.isArray(response.data) && response.data.length !== 0) {
            setRecommendedByUsers(response.data);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    getRecommentUserByMe();
  }, [API_URL, storeMySeq]);

  useEffect(() => {
    console.log("추천받은 유저", recommendedByUsers, recommendedByUsers.length);
  }, [recommendedByUsers]);

  const pageSize = 6; // 한 페이지에 보여줄 아이템 수
  const autoPageSize = 1;

  const [initialCurrentPage, setInitialCurrentPage] = useState(1);
  const [autoInitialCurrentPage, setAutoInitialCurrentPage] = useState(1);
  const startIdx = (initialCurrentPage - 1) * pageSize;
  const InitialCurrentData = recommendedByUsers.slice(
    startIdx,
    startIdx + pageSize
  );
  const autoInitialCurrentData = recommendedByUsers.slice(
    (autoInitialCurrentPage - 1) * autoPageSize,
    autoInitialCurrentPage * autoPageSize
  );

  const handlePageChange = (page: number) => {
    setInitialCurrentPage(page);
  };

  useEffect(() => {
    if (recommendedByUsers.length === 0) return;

    const intervalId = setInterval(() => {
      setAutoInitialCurrentPage((prevPage) => {
        if (prevPage * autoPageSize >= recommendedByUsers.length) {
          return 1;
        }
        return prevPage + 1;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [recommendedByUsers]);

  return (
    <>
      <Box>
        <Text
          textStyle="2xl"
          fontWeight="bold"
          marginLeft="30px"
          font-family="MiceMyungjo"
        >
          유저 추천
        </Text>
      </Box>
      {recommendedByUsers.length > 0 ? (
        <Box marginTop="15px" display="flex" flexDirection="row" height="100%">
          <Box width="65%" paddingX="20px">
            <PaginationRoot
              count={recommendedByUsers.length}
              pageSize={pageSize}
              defaultPage={1}
            >
              <HStack gap="4" justifyContent="flex-end" mt="4">
                <PaginationPrevTrigger
                  onClick={() => handlePageChange(initialCurrentPage - 1)}
                  backgroundColor="white"
                />
                <PaginationPageText />
                <PaginationNextTrigger
                  onClick={() => handlePageChange(initialCurrentPage + 1)}
                  backgroundColor="white"
                />
              </HStack>
            </PaginationRoot>
            <Grid templateColumns="repeat(3, 1fr)" gap={6} marginTop="20px">
              {InitialCurrentData.map((user, index) => (
                <Box
                  key={index}
                  width="100%"
                  height="200px"
                  background="white"
                  borderRadius="15px"
                  backgroundImage={`url(https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${user.profileImage})`}
                  backgroundSize="cover"
                  backgroundPosition="center"
                  display="flex"
                  alignItems="flex-end"
                  cursor="pointer"
                  onClick={() =>
                    goOtherFeed(
                      user.artistSeq,
                      user.nickname,
                      user.profileImage
                    )
                  }
                  _hover={{
                    transform: "scale(1.1)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <Box
                    width="100%"
                    background="rgba(0, 0, 0, 0.5)"
                    display="flex"
                    justifyContent="center"
                  >
                    <Text color="white" fontSize="32px" fontFamily="KotraHope">
                      {user.nickname}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Box>
          <Box
            width="35%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            {autoInitialCurrentData.map((user: any, index: number) => (
              <Box
                key={index}
                background="white"
                borderRadius="15px"
                width="90%"
                height="300px"
                marginY="10px"
                backgroundImage={`url(https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${user.profileImage})`}
                backgroundSize="cover"
                backgroundPosition="center"
                display="flex"
                alignItems="flex-end"
                cursor="pointer"
                marginBottom="60px"
                _hover={{
                  transform: "scale(1.1)",
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                <Box
                  width="100%"
                  height="80px"
                  background="rgba(0, 0, 0, 0.5)"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="white" fontSize="24px" fontFamily="KotraHope">
                    {user.nickname}
                  </Text>
                  <Box display="flex" flexDirection="row">
                    <Text color="white" fontSize="24px" fontFamily="KotraHope">
                      {user.genre}
                    </Text>
                    <Text
                      color="white"
                      fontSize="24px"
                      fontFamily="KotraHope"
                      marginLeft="5px"
                    >
                      {user.position}
                    </Text>
                  </Box>
                  <Text color="white" fontSize="md" fontFamily="KotraHope">
                    {user.region}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Text marginLeft="30px">추천받은 유저가 없습니다.</Text>
      )}
    </>
  );
};

export default CommunityRecommendUser;
