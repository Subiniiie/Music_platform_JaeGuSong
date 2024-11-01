import { Box, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

export default function Title() {
  const location = useLocation();

  // 경로에 따른 제목 설정
  let titleText = "디바이더"; // 기본 제목
  if (location.pathname === "/ws/list") {
    titleText = "워크스페이스";
  } else if (location.pathname === "/another-page") {
    titleText = "Another Page Title";
  }

  return (
    <Box
      padding="16px"
      fontFamily="GhanaChocolate"
      fontSize="2xl"
      color="white"
    >
      <Text>{titleText}</Text>
    </Box>
  );
}
