import { Box, Text } from '@chakra-ui/react';
import Container from '@/components/auth/signin/container';

export default function SignInView() {
  return (
    <Box color="white">
      <Text fontFamily="MiceGothicBold">로그인</Text>
      <Container />
    </Box>
  ) 
}
