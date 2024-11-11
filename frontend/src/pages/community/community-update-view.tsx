import React from 'react';
import { Box } from '@chakra-ui/react';
import UpdateContainer from '@/components/community/update-container';
import Header from '@/components/community/header';
import Container from '@/components/community/container';


const CommunityUpdateView: React.FC = () => {

  return (
    <>
    <Header />
      <Container>
        <Box>
          <UpdateContainer />
        </Box>
      </Container>
    </>
  );
};

export default CommunityUpdateView;