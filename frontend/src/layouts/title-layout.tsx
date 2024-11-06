import { Outlet } from "react-router-dom";
import { Box, Stack } from "@chakra-ui/react";
import Title from "@/sections/title";

export default function TitleLayout() {
  return (
    <Stack gap="8px" height="100vh" alignItems="stretch">
      {/* Title */}
      <Box
        height={{ base: "70px", md: "80px" }} // 최소 폭 설정
        minHeight="70px"
        p="4"
        boxShadow="md"
        background="#02001F"
      >
        <Title />
      </Box>

      {/* Outlet (content area) */}
      <Stack
        flex="1"
        p="4"
        mx="32px"
        borderTopRadius="15px"
        bg="#100035" // 배경색 설정
        border="2px solid"
        borderColor="#50009A" // 테두리 색상 설정
        borderBottom="none" // 하단 테두리 제거
        display="flex"
        alignItems="stretch"
        // justifyContent="center"
      >
        <Outlet />
      </Stack>
    </Stack>
  );
}
