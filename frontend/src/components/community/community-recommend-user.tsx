import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, HStack, Text, Grid } from '@chakra-ui/react';
import {
    PaginationNextTrigger,
    PaginationPageText,
    PaginationPrevTrigger,
    PaginationRoot,
  } from "@/components/ui/pagination";
  import useCommon from '@/hooks/common/common';

const mockDataInitial = Array.from({ length: 20 }, (_, i) => `아이템 ${i + 1}`);

const CommunityRecommendUser: React.FC = () => {
    const { API_URL, storeMySeq, storedToken, getMySeq } = useCommon();
    const [recommendedByUsers, setRecommendedByUsers] = useState<any[]>([]);

    useEffect(() => {
        const getRecommentUserByMe = async () => {
            getMySeq()
            if (storeMySeq) {
                try {
                    console.log('보낸다', storeMySeq, storedToken)
                    const response = await axios.get(
                        `${API_URL}/api/recommend/${storeMySeq}/initial`,
                        {
                            headers: {
                                Authorization: `Bearer ${storedToken}`
                            },
                        }
                    )
                    console.log(' 유저 기반으로 추천받은 데이터', response.data)
                    if (Array.isArray(response.data) && response.data.length !== 0) {
                        setRecommendedByUsers(response.data)
                    }
                } catch(error) {
                    console.error(error)
                }
            }
        }
        getRecommentUserByMe();
    }, [API_URL, storeMySeq])

    const pageSize = 8; // 한 페이지에 보여줄 아이템 수 (2행 x 2열)
    const autoPageSize = 1;

    const [initialCurrentPage, setInitialCurrentPage] = useState(1);
    const [autoInitialCurrentPage, setAutoInitialCurrentPage] = useState(1);
    const [followlCurrentPage, setFollowlCurrentPage] = useState(1);
    const startIdx = (initialCurrentPage - 1) * pageSize;
    const InitialCurrentData = mockDataInitial.slice(startIdx, startIdx + pageSize);
    const autoInitialCurrentData = mockDataInitial.slice((autoInitialCurrentPage - 1) * autoPageSize, autoInitialCurrentPage * autoPageSize);

    const handlePageChange = (page: number) => {
    setInitialCurrentPage(page);
    };
    
    const startAutoIdx = (autoInitialCurrentPage - 1) * pageSize;
    const autoInitialData = mockDataInitial.slice(startAutoIdx, startAutoIdx + pageSize);
    
    useEffect(() => {
    // 페이지네이션을 자동으로 변경하기 위한 setInterval
    const intervalId = setInterval(() => {
        setAutoInitialCurrentPage((prevPage) => {
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
            <Text textStyle="2xl">추천 유저 - 자기 기준</Text>
            {recommendedByUsers.length > 0 ? (
                <Box marginTop="15px" display="flex" flexDirection="row" height="100%">
                    <Box width="50%" height="100%" paddingLeft="200px">
                        <PaginationRoot count={mockDataInitial.length} pageSize={pageSize} defaultPage={1}>
                            <HStack gap="4" justifyContent="flex-end" mt="4">
                                <PaginationPrevTrigger 
                                    onClick={() => handlePageChange(followlCurrentPage - 1)}
                                />
                                <PaginationPageText />
                                <PaginationNextTrigger 
                                    onClick={() => handlePageChange(followlCurrentPage + 1)}
                                />
                            </HStack>
                        </PaginationRoot>
                        {/* 2열 그리드 레이아웃 */}
                        <Grid templateColumns="repeat(4, 1fr)" gap={2} marginTop="15px">
                            {InitialCurrentData.map((item, index) => (
                                <Box key={index} background="gray.100" borderRadius="md" width="95px" height="95px">
                                <Text color="black">{item}</Text>
                                </Box>
                            ))}
                        </Grid>
                    </Box>
                    <Box width="50%" height="100%" display="flex" marginLeft="20px">
                        <Box background="white" borderRadius="md" padding="10px" width="185px" height="260px" margin="20px 0">
                            <Text color="black">{autoInitialCurrentData}</Text>
                        </Box>
                    </Box>
                </Box>
                ) : (
                    "추천받은 유저가 없습니다."
                )}
        </>
  );
};

export default CommunityRecommendUser;