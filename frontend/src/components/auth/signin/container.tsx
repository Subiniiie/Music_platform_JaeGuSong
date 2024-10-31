import React from 'react';
import Input from './input';
import { Box, Heading } from '@chakra-ui/react';

const Container: React.FC = () => {
  return (
    <Box
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      minH="100vh"
      marginTop="20px"
      fontFamily="MiceGothicBold"
    >
      <Heading mb={4}>로그인</Heading>
      <Input />
    </Box>
  );
};

export default Container;