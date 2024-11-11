import React, { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import Header from '@/components/community/header';
import Container from '@/components/community/container';
import ArticleList from '@/components/community/artice-list';
import ArticleMusicList from '@/components/community/article-music-list';
import CommunityButton2 from '@/components/community/community-button-2';
import useCommunityMain from '@/hooks/community/useCommunityMain';


const CommunityMyCommunityView: React.FC = () => {
  const {
    feedState,
    goMusicMainFeed,
    goMainFeed
  } = useCommunityMain();


  return (
    <Box>
      <Header />
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
        {feedState ? <ArticleList /> : <ArticleMusicList />}
        </Box>
      </Container>
    </Box>
  );
};

export default CommunityMyCommunityView;