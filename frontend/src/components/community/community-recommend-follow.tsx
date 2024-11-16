import React, { useState, useEffect } from 'react';
import { Box, HStack, Text, Grid } from '@chakra-ui/react';
import {
    PaginationNextTrigger,
    PaginationPageText,
    PaginationPrevTrigger,
    PaginationRoot,
  } from "@/components/ui/pagination";

const mockDataInitial = Array.from({ length: 20 }, (_, i) => `아이템 ${i + 1}`);


const CommunityRecommendFollow: React.FC = () => {
    const pageSize = 8; // 한 페이지에 보여줄 아이템 수 (2행 x 2열)
    const autoPageSize = 1;

    // 팔로우 기반으로
  const [followlCurrentPage, setFollowlCurrentPage] = useState(1);

  const [autofollowlCurrentPage, setAutofollowlCurrentPage] = useState(1);


  // 현재 페이지에 해당하는 데이터 계산
  const followStartIdx = (followlCurrentPage - 1) * pageSize;
  const followlCurrentData = mockDataInitial.slice(followStartIdx, followStartIdx + pageSize);

  const autofollowlCurrentData = mockDataInitial.slice((autofollowlCurrentPage - 1) * autoPageSize, autofollowlCurrentPage * autoPageSize);

  // 페이지 변경 핸들러
  const handleFollowPageChange = (page: number) => {
    setFollowlCurrentPage(page);
  };

  const startAutoFollowIdx = (autofollowlCurrentPage - 1) * pageSize;
  const autoFollowData = mockDataInitial.slice(startAutoFollowIdx, startAutoFollowIdx + pageSize);

  useEffect(() => {
    // 페이지네이션을 자동으로 변경하기 위한 setInterval
    const intervalId = setInterval(() => {
      setAutofollowlCurrentPage((prevPage) => {
        if (prevPage * autoPageSize >= mockDataInitial.length) {
          return 1; // 마지막 페이지에 도달하면 첫 번째 페이지로 돌아감
        }
        return prevPage + 1;
      });
    }, 2000); // 2초 간격으로 페이지 변경

    // 컴포넌트가 언마운트될 때 interval을 정리
    return () => clearInterval(intervalId);
  }, []);


    return (
        <>
            <Text textStyle="2xl">추천 유저 - 팔로우 기반</Text>
            <Box marginTop="15px" display="flex" flexDirection="row" height="100%">
                <Box width="50%" height="100%" paddingLeft="200px">
                    <PaginationRoot count={mockDataInitial.length} pageSize={pageSize} defaultPage={1}>
                        <HStack gap="4" justifyContent="flex-end" mt="4">
                            <PaginationPrevTrigger 
                            onClick={() => handleFollowPageChange(followlCurrentPage - 1)}
                            />
                            <PaginationPageText />
                            <PaginationNextTrigger 
                            onClick={() => handleFollowPageChange(followlCurrentPage + 1)}
                            />
                        </HStack>
                    </PaginationRoot>
                    {/* 2열 그리드 레이아웃 */}
                    <Grid templateColumns="repeat(4, 1fr)" gap={2} marginTop="15px">
                        {followlCurrentData.map((item, index) => (
                            <Box key={index} background="gray.100" borderRadius="md" width="95px" height="95px">
                            <Text color="black">{item}</Text>
                            </Box>
                        ))}
                    </Grid>
                </Box>
                <Box width="50%" height="100%" display="flex" marginLeft="20px">
                    <Box background="white" borderRadius="md" padding="10px" width="185px" height="260px" margin="20px 0">
                    <Text color="black">{autofollowlCurrentData}</Text>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default CommunityRecommendFollow;