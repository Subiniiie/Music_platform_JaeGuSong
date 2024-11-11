import React, { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import CommunityButton2 from '@/components/community/community-button-2';
import ArticleList from '@/components/community/artice-list';
import ArticleMusicList from '@/components/community/article-music-list';
import Container from '@/components/community/container';
import Header from '@/components/community/header';
import CrewHeader from '@/components/community/crew-header';
import useCommunityMain from '@/hooks/community/useCommunityMain';
import useHeaderStore from '@/stores/headerStore';

const CommunityMainView: React.FC = () => {
  
  const {
    feedState,
    goMusicMainFeed,
    goMainFeed
  } = useCommunityMain();

  const { openUserHeader } = useHeaderStore(state => state);

  useEffect(() => {
  }, [openUserHeader])


  return (
    <>
      {openUserHeader ? <Header /> : <CrewHeader />}
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