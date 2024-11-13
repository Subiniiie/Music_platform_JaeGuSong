import React from 'react';
import { MyMusicFeedList } from './article-music-list';
import { Text, Button, Box } from '@chakra-ui/react';
import useCommunityMusic from '@/hooks/community/useCommunityMusic';

interface MusicArticleItemsProps {
    myMusic: MyMusicFeedList;
}

const MusicArticleItems: React.FC<MusicArticleItemsProps> = ({ myMusic }) => {
    const {
        goMusicFeedDetail 
    } = useCommunityMusic();

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
            background="linear-gradient(145deg, #1a1a2e, #1c1b3f)" // 원래 쓰던 색상
            borderRadius="20px"
            padding="30px"
            position="relative"
            overflow="hidden" // 요소가 넘칠 경우 숨기기
            transition="all 0.3s ease" // 전환 효과 추가
        >
            <Box marginTop="20px">
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
            >
                워크스페이스 가기
            </Button>
        </Box>
    );
};

export default MusicArticleItems;
