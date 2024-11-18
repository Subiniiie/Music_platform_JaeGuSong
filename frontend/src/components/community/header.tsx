import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Text } from '@chakra-ui/react';
import CommunityButton from './community-button';
import { useNavigate } from 'react-router-dom';
import paths from '@/configs/paths';

const Header: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [myNickname, setMyNickname] = useState<string>('');
  const [myProfileImage, setMyProfileImage] = useState<string>('');
  const [mygenre, setMygenre] = useState<string>('');
  const [myposition, setMyposition] = useState<string>('');
  const [myregion, setMyregion] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedToken = localStorage.getItem('jwtToken');
      if (storedToken) {
        try {
          const response = await axios.get(
            `${API_URL}/api/user`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
              withCredentials: true,
            }
          );
          setMyNickname(response.data.nickname);
          setMyProfileImage(response.data.profileImage);
          setMygenre(response.data.genre);
          setMyposition(response.data.position);
          setMyregion(response.data.region);
          console.log('내 정보', response.data)
        } catch (error) {
          console.warn('Error during API request:', error);
        }
      } else {
        console.warn('No stored token found');
      }
    };

    fetchUserInfo();
  }, []);

  const goCreateArticle = () => {
    navigate(paths.community.create);
  };

  const goCreateMusicArticle = () => {
    navigate(paths.divider.upload);
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="250px"
      width="calc(100% - 250px)"
      padding="4"
      boxShadow="md" // 그림자 추가
      zIndex={10} // 헤더가 항상 상단에 오도록 설정
    >
      <Box height="70px">
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="15px" // 프로필 이미지와 텍스트 사이 간격 추가
        >
          <Box
            width="70px"
            height="70px"
            borderRadius="full" // 프로필 이미지를 원형으로
            overflow="hidden"
            border="2px solid #fff" // 테두리 추가
            boxShadow="0 0 10px rgba(0, 0, 0, 0.2)" // 그림자 효과 추가
          >
            <img
              src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${myProfileImage}`}
              alt={myProfileImage}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" alignItems="center">
              <Text
                textStyle="3xl"
                fontWeight="bold"
                color="white"
                marginTop="10px"
              >
                {myNickname}
              </Text>
              <Text
                textStyle="xl"
                color="whiteAlpha.800"
                marginTop="10px"
                marginLeft="10px"
              >
                님의 피드
              </Text>
              </Box>
              <Box display="flex" flexDirection="row" marginTop="10px">
                <Text>{mygenre}</Text>
                <Text marginLeft="10px">{myposition}</Text>
                <Text marginLeft="10px">{myregion}</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      
      <Box
        marginTop="20px"
        marginRight="20px"
        display="flex"
        justifyContent="flex-end"
        gap="10px"
      >
        <CommunityButton
          title="글쓰기"
          onClick={goCreateArticle}
          bg="teal.500"
          color="white"
          _hover={{
            bg: 'teal.600',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          }} // 호버 효과
        />
        <CommunityButton
          title="음원피드 올리기"
          onClick={goCreateMusicArticle}
          bg="purple.500"
          color="white"
          _hover={{
            bg: 'purple.600',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          }} // 호버 효과
        />
      </Box>
    </Box>
  );
};

export default Header;
