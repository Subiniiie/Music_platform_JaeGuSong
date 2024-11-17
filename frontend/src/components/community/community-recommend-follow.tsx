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
  import useSearch from '@/hooks/search/useSearch';


const CommunityRecommendFollow: React.FC = () => {
    const pageSize = 8; // 한 페이지에 보여줄 아이템 수 (2행 x 2열)
    const autoPageSize = 1;
    const { API_URL, storeMySeq, storedToken, getMySeq } = useCommon();
    const [recommendedByFollows, setRecommendedByFollows] = useState<any[]>([]);
    const { goOtherFeed } = useSearch();

    useEffect(() => {
        const getRecommentUserByFollow = async () => {
            getMySeq()
            if (storeMySeq) {
                try {
                    console.log('팔로우 기반 추천 보낸다', storeMySeq, storedToken)
                    const response = await axios.get(
                        `${API_URL}/api/recommend/${storeMySeq}`,
                        {
                            headers: {
                                Authorization: `Bearer ${storedToken}`
                            },
                        }
                    )
                    console.log('팔로우 기반으로 추천받은 데이터', response.data)
                    if (Array.isArray(response.data) && response.data.length !== 0) {
                        setRecommendedByFollows(response.data)
                    }
                } catch(error) {
                    console.error(error)
                }
            }
        }
        getRecommentUserByFollow();
    }, [API_URL, storeMySeq])

    useEffect(() => {
        console.log('추천받은 유저', recommendedByFollows, recommendedByFollows.length)
    }, [recommendedByFollows])

    // 팔로우 기반으로
  const [followlCurrentPage, setFollowlCurrentPage] = useState(1);

  const [autofollowlCurrentPage, setAutofollowlCurrentPage] = useState(1);


  // 현재 페이지에 해당하는 데이터 계산
  const followStartIdx = (followlCurrentPage - 1) * pageSize;
  const followlCurrentData = recommendedByFollows.slice(followStartIdx, followStartIdx + pageSize);

  const autofollowlCurrentData = recommendedByFollows.slice((autofollowlCurrentPage - 1) * autoPageSize, autofollowlCurrentPage * autoPageSize);

  // 페이지 변경 핸들러
  const handleFollowPageChange = (page: number) => {
    setFollowlCurrentPage(page);
  };

  const startAutoFollowIdx = (autofollowlCurrentPage - 1) * pageSize;
  const autoFollowData = recommendedByFollows.slice(startAutoFollowIdx, startAutoFollowIdx + pageSize);

  useEffect(() => {
    if (recommendedByFollows.length === 0) return;

    // 페이지네이션을 자동으로 변경하기 위한 setInterval
    const intervalId = setInterval(() => {
      setAutofollowlCurrentPage((prevPage) => {
        if (prevPage * autoPageSize >= recommendedByFollows.length) {
          return 1; // 마지막 페이지에 도달하면 첫 번째 페이지로 돌아감
        }
        return prevPage + 1;
      });
    }, 2000); // 2초 간격으로 페이지 변경

    // 컴포넌트가 언마운트될 때 interval을 정리
    return () => clearInterval(intervalId);
  }, [recommendedByFollows]);


    return (
        <>
            <Box>
                <Text textStyle="2xl" fontWeight="bold" marginLeft="30px" font-family= "MiceMyungjo">추천 유저</Text>
            </Box>     
            {recommendedByFollows.length > 0 ? (
                <Box marginTop="15px" display="flex" flexDirection="row" height="100%">
                    <Box width="50%" height="100%" paddingLeft="200px">
                        <PaginationRoot count={recommendedByFollows.length} pageSize={pageSize} defaultPage={1}>
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
                            {recommendedByFollows.map((user, index) => (
                                <Box 
                                    key={index} 
                                    width="95px" 
                                    height="95px"
                                    background="white"
                                    borderRadius="10px"
                                    backgroundImage={`url(https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${user.profileImage})`} // 이미지 URL 사용
                                    backgroundSize="contain"
                                    backgroundPosition="center"
                                    backgroundRepeat="no-repeat" 
                                    display="flex"
                                    alignItems="flex-end"
                                    cursor="pointer"
                                    onClick={() => goOtherFeed(user.artistSeq, user.nickname, user.profileImage)}
                                >
                                    <Box
                                        width="100%"
                                        background="rgba(0, 0, 0, 0.3)"
                                        display="flex"
                                        justifyContent="center"
                                    > 
                                        <Text color="white" fontFamily="KotraHope">{user.nickname}</Text>
                                    </Box>
                                </Box>
                            ))}
                        </Grid>
                    </Box>
                    <Box width="50%" height="100%" display="flex" marginLeft="20px">
                    {autofollowlCurrentData.map((user: any, index: number) => (
                            <Box 
                                key={index}
                                background="white" 
                                borderRadius="md" 
                                width="185px" 
                                height="260px" 
                                margin="20px 0"
                                backgroundImage={`url(https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${user.profileImage})`} // 이미지 URL 사용
                                backgroundSize="contain"
                                backgroundPosition="center" 
                                backgroundRepeat="no-repeat"
                                display="flex"
                                alignItems="flex-end"
                                cursor="pointer"
                            >
                                <Box
                                    width="100%"
                                    height="80px"
                                    background="rgba(0, 0, 0, 0.3)"
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Text color="white" fontSize="lg" fontFamily="KotraHope">{user.nickname}</Text>
                                    <Box display="flex" flexDirection="row">
                                        <Text color="white" fontSize="lg" fontFamily="KotraHope">{user.genre}</Text>
                                        <Text color="white" fontSize="lg" fontFamily="KotraHope" marginLeft="5px">{user.position}</Text>
                                    </Box>
                                    <Text color="white" fontSize="lg" fontFamily="KotraHope">{user.region}</Text>
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

export default CommunityRecommendFollow;