import WsButton from "@/components/workspace/wsButton";
import { Flex, Stack, Button } from "@chakra-ui/react";
import SessionUploadButton from "./sessionUploadButton";
import { useWsDetailStore } from "@/stores/wsDetailStore";

interface ButtonBoxProps {
  workspaceSeq: number; // workspaceSeq를 props로 추가
  wsDetails: {
    name: string;
    originTitle: string;
    originSinger: string;
    role: string;
    state: string;
  };
  buttonBoxHeight: string;
}

export default function ButtonBox({
  workspaceSeq,
  wsDetails,
  buttonBoxHeight,
}: ButtonBoxProps) {
  const checkedSessions = useWsDetailStore((state) => state.checkedSessions);
  const updateSession = useWsDetailStore((state) => state.updateSession);

  const handleResetSettings = () => {
    console.log("체크된 세션:", checkedSessions);

    // 체크된 세션들의 startPoint와 endPoint를 초기화
    checkedSessions.forEach((sessionId) => {
      updateSession(sessionId, { startPoint: Infinity, endPoint: 0 });
    });

    console.log("설정 리셋 완료");
  };

  return (
    <Stack
      onClick={(e) => e.stopPropagation()}
      direction="row"
      bg="gray.800"
      padding="6"
      borderRadius="15px"
      border="0.5px solid rgba(255, 255, 255, 0.2)"
      gap="4"
      justifyContent="center"
      alignItems="center"
      background="rgba(0, 0, 0, 0.3)"
      height={buttonBoxHeight}
    >
      <Flex gap="4" onClick={(e) => e.stopPropagation()}>
        {/* {wsDetails.role === "MASTER" && ( */}
        {/* <> */}
        {/* <WsButton>시작지점 설정</WsButton> */}
        {/* <WsButton>종료지점 설정</WsButton> */}
        {/* <WsButton>설정 리셋</WsButton>
            <SessionUploadButton workspaceSeq={workspaceSeq} />
          </> */}
        {/* // )} */}

        <Button
          onClick={handleResetSettings}
          bg="blackAlpha.900" // 검은 배경
          color="white" // 텍스트 색상
          border="2px solid" // 테두리 두께
          borderColor="purple.500" // 보라색 테두리
          borderRadius="md" // 모서리 둥글게
          _hover={{ bg: "purple.700" }} // 호버 효과
          _active={{ bg: "purple.800" }} // 클릭 효과
          paddingX="4"
          paddingY="2"
          width="110px"
          height="46px"
          fontWeight="bold"
          disabled={false}
        >
          설정 리셋
        </Button>
        <SessionUploadButton workspaceSeq={workspaceSeq} />
      </Flex>
    </Stack>
  );
}
