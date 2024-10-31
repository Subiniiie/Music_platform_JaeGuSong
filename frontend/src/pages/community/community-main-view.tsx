import React from 'react';
import { Button, Box } from '@chakra-ui/react';
import CommunityButton from '@/components/community/community-button';
import ArticleList from '@/components/community/artice-list';

const CommunityMainView: React.FC = () => {
  return (
    <Box>
        <CommunityButton title='피드' />
        <CommunityButton title='음원 피드' />
        <ArticleList />
    </Box>
  );
};

export default CommunityMainView;