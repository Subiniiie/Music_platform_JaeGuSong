import React, { useEffect, useInsertionEffect, useState } from 'react';
import { MyMusicFeedList } from './article-music-list';
import { Text, Button, Box } from '@chakra-ui/react';
import useCommunityMusic from '@/hooks/community/useCommunityMusic';

interface MusicArticleItemsProps {
    myMusic: MyMusicFeedList;
}

const MusicArticleItems: React.FC<MusicArticleItemsProps> = ({ myMusic }) => {
    const [ getThumbnail, setGetThumbnail ] = useState<string>('/headphone-dynamic-premium.png');
    const [ getState, setGetState ] = useState<string>("PUBLIC");
    const {
        goMusicFeedDetail 
    } = useCommunityMusic();

    useEffect(() => {
        if (myMusic.thumbnail !== 'https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/') {
            setGetThumbnail(myMusic.thumbnail)
        }
        setGetState(myMusic.state);
    }, []) 


    return (
        <Box 
            width="320px" 
            height="380px"
            boxShadow="0 15px 30px rgba(0, 0, 0, 0.2)" // 부드러운 그림자 효과
            _hover={{
                transform: "scale(1.05)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)", // 호버 시 그림자 크기 증가
                border: "3px solid #6a4bff", 
            }}
            position="relative" // 오버레이를 위한 상대 위치
            borderRadius="20px"
            overflow="hidden" // 요소가 넘칠 경우 숨기기
            transition="all 0.3s ease" // 전환 효과 추가
        >
            {/* 배경 이미지 */}
            <Box 
                position="absolute" 
                top="50%" 
                left="50%" 
                width="50%" 
                height="50%" 
                backgroundImage={`url(${getThumbnail})`} // 배경 이미지 설정
                backgroundSize="cover" // 이미지가 박스를 꽉 채우도록
                backgroundPosition="center" // 이미지 중앙에 정렬
                backgroundRepeat="no-repeat"
                transform="translate(-50%, -50%)"
                zIndex="1" // 오버레이 아래 배치
            />
            
            {/* 은은한 회색 오버레이 */}
            <Box 
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                background="rgba(0, 0, 0, 0.3)" // 회색빛 반투명 오버레이
                zIndex="2" // 콘텐츠 아래 배치
            />

            {/* 콘텐츠 */}
            <Box 
                zIndex="3" // 오버레이 위에 표시
                position="relative"
                padding="30px"
                display="flex" // Flexbox 사용
                flexDirection="column" // 세로 방향 정렬
                justifyContent="center" // 세로 가운데 정렬
                alignItems="center" // 가로 가운데 정렬
                height="100%" // 부모 크기 기준 정렬
            >
                <Box    
                
                    background={getState === 'PUBLIC' ? "#4682B4" : "#FF6347"}
                    color="white"
                    fontSize="xs"
                    fontWeight="medium"
                    borderRadius="20px"
                    padding="6px 12px"
                    boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
                    marginBottom="15px"
                >
                    {getState}
                </Box>
                {/* 글자 크기 및 정렬 조정 */}
                <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="white" textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)">
                    {myMusic.name}
                </Text>
                <Box 
                    marginTop="60px"
                    opacity={0} 
                    transition="opacity 0.5s ease-in-out"
                    height="250px" 
                    _hover={{
                        opacity: 1, // 그룹 호버 시 텍스트 등장
                    }}
                >
                    <Text 
                        fontSize="xl" 
                        textAlign="center" 
                        color="white" 
                        fontWeight="medium" 
                        marginBottom="10px"
                        _groupHover={{
                            color: "#6a4bff", // 호버 시 색상 변경
                            fontSize: "2xl", // 호버 시 크기 증가
                            fontWeight: "bold", // 호버 시 굵게
                        }}
                    >
                        {myMusic.originSinger}
                    </Text>
                    <Text 
                        fontSize="lg" 
                        textAlign="center" 
                        color="white" 
                        fontStyle="italic"
                        _groupHover={{
                            color: "#6a4bff", // 호버 시 색상 변경
                            fontSize: "xl", // 호버 시 크기 증가
                        }}
                    >
                        {myMusic.originTitle}
                    </Text>
                </Box>
            </Box>

            {/* 버튼: 콘텐츠보다 위에 배치 */}
            <Button 
                variant="solid"
                backgroundColor="#3b3b6d" // 남색 배경색
                color="white"
                borderRadius="12px" // 둥근 모서리
                padding="10px 20px" // 버튼 안쪽 여백
                _hover={{
                    backgroundColor: "#6a4bff", // 호버 시 배경색
                    color: "#1a1a2e", // 호버 시 글자색
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)", // 호버 시 그림자 효과
                }}
                onClick={() => goMusicFeedDetail(myMusic.workspaceSeq)}
                position="absolute"
                bottom="30px" 
                left="50%" 
                transform="translateX(-50%)"
                zIndex="4" // 모든 요소보다 위에 표시
            >
                워크스페이스 가기
            </Button>
        </Box>

    );
};

export default MusicArticleItems;
