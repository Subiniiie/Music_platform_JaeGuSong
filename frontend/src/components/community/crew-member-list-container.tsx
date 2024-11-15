import React, { useState, useEffect } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { CrewData } from './crew-member-list-modal';
import axios from 'axios';
import  CrewMemeberListFeed from './crew-member-list-feed';
import  CrewMemberListChat  from './crew-member-list-chat';
import useCommon from '@/hooks/common/common';


interface CrewMemeberListContainerProps {
    crewData: CrewData | null;
    onClose: () => void;
}


const CrewMemeberListCotainer: React.FC<CrewMemeberListContainerProps> = ({ crewData, onClose }) => {
    const boardUserSeq = crewData?.crews.find((item) => item.crewUserState === "BOARD")?.seq;
    const chatUserSeq = crewData?.crews.find((item) => item.crewUserState === "CHAT")?.seq;
    const [ checkManagerSeq, setCheckManagerSeq ] = useState(false);

    const { API_URL, storedToken, id } = useCommon();

    const [feedValue, setFeedValue] = useState<string>(boardUserSeq?.toString() || '');  // Feed value state
    const [chatValue, setChatValue] = useState<string>(chatUserSeq?.toString() || '');  // Chat value state



      useEffect(() => {
        if (crewData && crewData.manager) {
          const authStorage = localStorage.getItem("auth-storage");
          let artistSeq: number | null = null;
    
          if (authStorage) {
            try {
              const parsedData = JSON.parse(authStorage);
              artistSeq = parsedData?.state?.artistSeq || null;
              if (artistSeq === crewData.manager.seq) {
                setCheckManagerSeq(true);
              }
            } catch (error) {
              console.error("Failed to parse auth-storage:", error);
            }
          }
        }
      }, [crewData]); 

      if (!crewData || !crewData.crews) {
        // crewData or crewData.crews is not available, render loading state
        return <Text>로딩 중...</Text>;
    }

    const handleGrantSubmit = async () => {
        const crewsToGrant = crewData?.crews
            .map(member => {
                            // 각 멤버에 대해 state 값을 설정
                let state = 'NONE'; // 기본 값

                if (member.seq === parseInt(chatValue)) {
                    state = 'CHAT'; // 채팅 사용자
                } else if (member.seq === parseInt(feedValue)) {
                    state = 'BOARD'; // 피드 사용자
                }

                return {
                    userSeq: member.seq,
                    state: state,
                };
            })
            .filter(crew => crew.state);
        try {
        const response = await axios.put(
            `${API_URL}/api/crew/grant/${id}`,
            {
            crewSeq: id,
            crews: crewsToGrant
            },
            {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
            }
        )
        console.log('나 권한 준다', response.data)
        onClose()
        } catch(error) {
        console.error(error)
        }
        }
    
  return (
    <>
        <Box 
        marginTop="20px"
        display="flex" 
        flex="row"
        css={{
        /* Webkit 기반 브라우저 스크롤바 스타일 */
        "&::-webkit-scrollbar": {
            width: "8px", // 스크롤바 너비
        },
        "&::-webkit-scrollbar-track": {
            background: "#e0e0e0", // 스크롤바 트랙 배경색
            borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#9000ff", // 스크롤바 색상
            borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#6d00cc", // 호버 시 색상
        },
        }}
    >
        <Box marginTop="40px">
        <Box 
            display="flex" 
            flexDirection="row"
            alignItems="center"
            gap="10px"
            marginBottom="8px"
            p="10px"
            borderRadius="10px"
            transition="background 0.3s, transform 0.3s"
            _hover={{
            background: "gray.100",
            transform: "scale(1.05)",
            boxShadow: "md",
            }}
            cursor="pointer"
        >
            <Box
            width="40px"
            height="40px"
            overflow="hidden"
            rounded="full"
            border="1px solid"
            borderColor="gray.300"
            >
            <img 
                src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${crewData?.manager.profileImage}`}
                style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                }}
            />
            </Box>
            <Text fontSize="md" color="black">{crewData?.manager.nickname}👑</Text>
        </Box> 
        {crewData?.crews.map((crewMember, index) => (
            <Box
            key={index}
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="10px"
            marginBottom="8px"
            p="10px"
            borderRadius="10px"
            transition="background 0.3s, transform 0.3s"
            _hover={{
                background: "gray.100",
                transform: "scale(1.05)",
                boxShadow: "md",
            }}
            cursor="pointer"
            >
            <Box
                width="40px"
                height="40px"
                overflow="hidden"
                rounded="full"
                border="1px solid"
                borderColor="gray.300"
            >
                <img
                src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${crewMember.profileImage}`}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                />
            </Box>
            <Text fontSize="md" color="black">
                {crewMember.nickname}
            </Text>
            </Box>
        ))}
        </Box> 
        <Box marginLeft="60px">
            <CrewMemeberListFeed crewData={crewData} boardUserSeq={boardUserSeq} checkManagerSeq={checkManagerSeq} feedValue={feedValue} setFeedValue={setFeedValue}/>
        </Box>
        <Box marginLeft="35px">
            <CrewMemberListChat crewData={crewData} chatUserSeq={chatUserSeq} checkManagerSeq={checkManagerSeq} chatValue={chatValue} setChatValue={setChatValue}/>
        </Box>  
    </Box>
    {checkManagerSeq &&
        <Button
            position="relative"
            bottom="-60px"
            width="300px"
            maxHeight="100px"
            onClick={handleGrantSubmit}
        >
            수정하기
        </Button>
    }
</>
  );
};

export default CrewMemeberListCotainer;