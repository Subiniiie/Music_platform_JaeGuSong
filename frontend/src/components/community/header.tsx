import React, { useState } from 'react';
import axios from 'axios';
import { Box } from '@chakra-ui/react';
import CommunityButton from './community-button';
import { useNavigate } from 'react-router-dom';
import paths from '@/configs/paths';

const Header: React.FC = () => {
    const navigate = useNavigate();

// const Header: React.FC = async () => {
    {/* 유저 정보 받아오기 */}
    // try {
    //     const response = await axios.get(
    //         `${API_URL}/api/users/info`,
    //     )
    // } catch(error) {
    //     console.log(error)
    // }

    const goCreateArticle = () => {
        navigate(paths.community.create);
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
        유저 정보 받아올거임
      </Box>        
      <Box 
        marginTop="20px"
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
          onClick={goCreateArticle}
        />
      </Box>        
    </Box>
  );
};

export default Header;