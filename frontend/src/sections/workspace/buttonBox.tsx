import WsButton from "@/components/workspace/wsButton";
import { Flex, Stack } from "@chakra-ui/react";

export default function ButtonBox() {
  return (
    <Stack direction="row" bg="gray.800" padding="4" borderRadius="md" gap="4">
      <Flex gap="2">
        <WsButton>시작지점 설정</WsButton>
        <WsButton>종료지점 설정</WsButton>
        <WsButton>설정내역 리셋</WsButton>
        <WsButton>세션 녹음하기</WsButton>
        <WsButton>잡음제거</WsButton>
        {/* <WsButton>통합음원 추출</WsButton> */}
      </Flex>
    </Stack>
  );
}
