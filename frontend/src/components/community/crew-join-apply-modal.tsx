import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, Button } from '@chakra-ui/react';
import axios from 'axios';
import CommunityButton from "./community-button";
import UseCommunityCrew from "@/hooks/community/useCommunityCrew";

interface JoinApplyUserData {
    seq: number;
    profileImage: string;
    email: string;
    nickname: string;
}


const CrewJoinApplyModal: React.FC = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams<{ id: string }>();
    const storedToken = localStorage.getItem('jwtToken');
    const [joinApplyUsers, setJoinApplyUsers] = useState<JoinApplyUserData[]>([]);
    const {
        handleCrewApproveModal,
        handleCrewDeclineModal,
    } = UseCommunityCrew();

    useEffect(() => {
        const getCrewJoinApplyUser = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/crew/waiting/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${storedToken}`
                        },
                    }
                )
                setJoinApplyUsers(response.data)
            } catch(error) {
                console.warn(error)
            }
        }
        getCrewJoinApplyUser();
    }, [id])

    useEffect(() => {
        console.log('바껴라!!', joinApplyUsers)
    }, [joinApplyUsers])

    
    return (
        <Box padding="20px" maxWidth="800px" margin="auto">
          {joinApplyUsers.length > 0 ? (
            joinApplyUsers.map((joinApplyUser) => (
              <Box
                key={joinApplyUser.seq}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                padding="15px"
                marginBottom="12px"
                backgroundColor="white"
                borderRadius="8px"
                boxShadow="none" // 경계선과 그림자 제거
                _hover={{
                  backgroundColor: '#f9fafb', // hover 시 배경색 변경
                }}
              >
                <Box
                  width="60px"
                  height="60px"
                  borderRadius="full"
                  overflow="hidden"
                  marginRight="15px"
                >
                  <img
                    src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${joinApplyUser.profileImage}`}
                    alt={`${joinApplyUser.nickname} 프로필`}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                </Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800" flex="1">
                  {joinApplyUser.nickname}
                </Text>
                <Box display="flex" gap="8px">
                  {/* 커스텀 버튼 사용 */}
                  <CommunityButton title="승인" onClick={() => handleCrewApproveModal({ userSeq: joinApplyUser.seq })} />
                  <CommunityButton title="거절" onClick={() => handleCrewDeclineModal({ userSeq: joinApplyUser.seq })} />
                </Box>
              </Box>
            ))
          ) : (
            <Text fontSize="lg" color="gray.500">
              가입 신청을 한 유저가 없습니다.
            </Text>
          )}
        </Box>
      );
    };
    

export default CrewJoinApplyModal;