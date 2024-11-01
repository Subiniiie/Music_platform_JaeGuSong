import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import UpdateContainer from '@/components/community/update-container';
import Header from '@/components/community/header';
import Container from '@/components/community/container';


const CommunityUpdateView: React.FC = () => {
  const { id } = useParams<{id: string}>();

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