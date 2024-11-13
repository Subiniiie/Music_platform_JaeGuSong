import React, { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import CommunityButton2 from '@/components/community/community-button-2';
import ArticleList from '@/components/community/artice-list';
import ArticleMusicList from '@/components/community/article-music-list';
import Container from '@/components/community/container';
import Header from '@/components/community/header';
import CrewHeader from '@/components/community/crew-header';
import OtherHeader from '@/components/community/otherHeader';
import OtherArticleList from '@/components/community/other-article-list';
import useCommunityMain from '@/hooks/community/useCommunityMain';
import axios from 'axios';
import useHeaderStore from "@/stores/headerStore";

const CommunityMainView: React.FC = () => {
  
  const {
    feedState,
    goMusicMainFeed,
    goMainFeed
  } = useCommunityMain();

  const { openUserHeader, otherUserNickname, otherUserProfileImage, setOpenUserHeader, setOpenOtherUserHeader } = useHeaderStore(state => state);
  const { id } = useParams<{id: string}>();
  const API_URL =import.meta.env.VITE_API_URL;
  const [ checkSearchUser, setCheckSearchUser ] = useState<boolean>(true);
  const {  } = useHeaderStore(state => state);

  useEffect(() => {
  }, [openUserHeader, otherUserNickname, checkSearchUser])

  useEffect(() => {
    const getCrewInfoCheck = async () => {
      const storedToken = localStorage.getItem('jwtToken');
      let crewSeq = 0;
  
      if (id === undefined) {
        crewSeq = 0;
      } else {
        crewSeq = parseInt(id);
      }
  
      try {
        const response = await axios.get(
          `${API_URL}/api/crew/${crewSeq}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setCheckSearchUser(false)
        setOpenUserHeader(false)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCheckSearchUser(true);
          setOpenUserHeader(true)
          setOpenOtherUserHeader(true)
        } else {
          console.warn(error);
        }
      }
    };
    getCrewInfoCheck();
  }, [id, otherUserNickname, openUserHeader]);
  


  return (
    <>
    {checkSearchUser ?  <OtherHeader otherUserNickname={otherUserNickname} otherUserProfileImage={otherUserProfileImage}/> : <CrewHeader />}
      <Container>
        <Box
          margin="10px 0"
          overflow= "auto"
        >
          <Box
            display="flex"
            alignItems="center"
          >
            <CommunityButton2 
              title='피드' 
              onClick={goMainFeed}
            />
            <Text>|</Text>
            <CommunityButton2 
              title='음원 피드'
              onClick={goMusicMainFeed} 
            />
          </Box>        
            { feedState ? <ArticleList /> : <ArticleMusicList/>}
        </Box>
      </Container>
    </>        
  );
};

export default CommunityMainView;