import { Box, Text } from '@chakra-ui/react';
import Container from '@/components/auth/signup/container';

export default function SignUpView() {
  return (
    <Box color="white">
      <Text fontFamily="MiceGothicBold">회원가입</Text>
      <Container />
    </Box>
  ) 
}
