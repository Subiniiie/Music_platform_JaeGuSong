import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import CommunityButton2 from '@/components/community/community-button-2';
import ArticleList from '@/components/community/artice-list';

const CommunityMainView: React.FC = () => {
  return (
    <Box
      margin="10px 0"
    >
      <Box
        display="flex"
        alignItems="center"
      >
        <CommunityButton2 title='피드' />
        <Text>|</Text>
        <CommunityButton2 title='음원 피드' />
      </Box>        
        <ArticleList />
    </Box>
  );
};

export default CommunityMainView;