import React from 'react';
import Input from './input';
import { Box, Heading } from '@chakra-ui/react';

const InputContainer: React.FC = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      minH="100vh"
      marginTop="20px"
    >
      <Heading mb={4}>게시물 작성</Heading>
      <Input />
    </Box>
  );
};

export default InputContainer;