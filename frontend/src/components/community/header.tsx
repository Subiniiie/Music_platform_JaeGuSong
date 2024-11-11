import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Text } from '@chakra-ui/react';
import CommunityButton from './community-button';
import { useNavigate } from 'react-router-dom';
import paths from '@/configs/paths';

const Header: React.FC =  () => {
  const API_URL =import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [ myNickname, setMyNickname ] = useState<string>('');
  const [ myProfileImage, setMyProfileImage ] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedToken = localStorage.getItem('jwtToken');
      if (storedToken) {
        try {
          const response = await axios.get(
            `${API_URL}/api/user`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`
              },
              withCredentials: true,
            }
          );
          setMyNickname(response.data.nickname)
          setMyProfileImage(response.data.profileImage)
        } catch (error) {
          console.warn('Error during API request:', error);
        }
      } else {
        console.warn('No stored token found');
      }
    };
  
    fetchUserInfo(); // 유저 정보 가져오기
  // }, [API_URL, getStoredToken, navigate, token]); // 필요한 의존성 추가
  }, []); // 필요한 의존성 추가
  

  const goCreateArticle = () => {
      navigate(paths.community.create);
  }

  const goCreateMusicArticle = () => {
    navigate(paths.divider.upload)
  }
  return (
    <Box
        position="fixed"
        top="0"
        left="250px"
        width="calc(100% - 250px)" 
        padding="4"
    >
      <Box
        height="70px"
      >
        <Box 
          display="flex" 
          flexDirection="row" 
          alignItems="center"
          gap="5px"
        >
          <Box width="70px" height="70px">
            <img src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${myProfileImage}`} alt={`${myProfileImage}`}></img>
          </Box>            
          <Text textStyle="3xl" marginTop="10px">{myNickname}</Text>
          <Text textStyle="xl" marginTop="10px">님의 피드</Text>
        </Box>          
      </Box>        
      <Box 
        marginTop="20px"
        marginRight="20px"
        display="flex"
        justifyContent="flex-end"
        gap="5px"
      >
        <CommunityButton 
          title='글쓰기'
          onClick={goCreateArticle}
          />
        <CommunityButton
          title='음원피드 올리기'
          onClick={goCreateMusicArticle}
        />
      </Box>        
    </Box>
  );
};

export default Header;