import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import UpdateContainer from '@/components/community/update-container';


const CommunityUpdateView: React.FC = () => {
  const { id } = useParams<{id: string}>();

  return (
    <Box>
      <UpdateContainer />
    </Box>
  );
};

export default CommunityUpdateView;