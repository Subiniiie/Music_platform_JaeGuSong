import React from "react";
import Input from "./input";
import { Box, Heading, Button } from "@chakra-ui/react";
import useAuth from "@/hooks/auth/useAuth";

const Container: React.FC = () => {
  const { goSignupPage } = useAuth();
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
      <Button
        variant="ghost"
        marginTop="10px"
        color="white"
        onClick={goSignupPage}
        _hover={{
          color: "black",
        }}
      >
        회원가입 하러 가기
      </Button>
    </Box>
  );
};

export default Container;
