import { Box, Text, Icon, Flex } from "@chakra-ui/react";
import { GrRevert } from "react-icons/gr";

import { useLocation, Link } from "react-router-dom";

export default function Title() {
  const location = useLocation();

  // 경로에 따른 제목 설정
  let titleText = "디바이더"; // 기본 제목
  let linkPath = null; // 링크 경로 초기화

  if (location.pathname === "/ws/list") {
    titleText = "워크스페이스";
  } else if (/^\/ws\/list\/\d+$/.test(location.pathname)) {
    // 정규식으로 "/ws/list/{artistSeq}" 경로 확인
    titleText = "워크스페이스";
    linkPath = "/ws/list"; // /ws/list로 링크 설정
  }

  return (
    <Box
      padding="16px"
      fontFamily="GhanaChocolate"
      fontSize="2xl"
      color="white"
    >
      {linkPath ? (
        <Link to={linkPath} style={{ textDecoration: "none", color: "white" }}>
          {/* 링크가 있는 경우 */}
          <Flex justifyContent="start" alignItems="center">
            <Text
              cursor="pointer"
              _hover={{ textDecoration: "none", color: "purple.300" }}
            >
              {titleText}
            </Text>
            <Icon
              fontSize="2xl"
              color="white"
              ml="4px"
              // _hover={{ color: "purple.300" }}
            >
              <GrRevert />
            </Icon>
          </Flex>
        </Link>
      ) : (
        // 링크가 없는 경우
        <Text>{titleText}</Text>
      )}{" "}
    </Box>
  );
}
