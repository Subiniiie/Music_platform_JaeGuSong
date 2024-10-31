import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';


const CommunityUpdateView: React.FC = () => {
  const { id } = useParams<{id: string}>();
  return (
    <Box>
      {id}
    </Box>
  );
};

export default CommunityUpdateView;