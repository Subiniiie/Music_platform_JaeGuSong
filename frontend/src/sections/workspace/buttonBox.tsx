import WsButton from "@/components/workspace/wsButton";
import { Flex, Stack } from "@chakra-ui/react";
import SessionUploadButton from "./sessionUploadButton";

interface ButtonBoxProps {
  workspaceSeq: number; // workspaceSeq를 props로 추가
  wsDetails: {
    name: string;
    originTitle: string;
    originSinger: string;
    role: string;
    state: string;
  };
}

export default function ButtonBox({ workspaceSeq, wsDetails }: ButtonBoxProps) {
  return (
    <Stack
      direction="row"
      bg="gray.800"
      padding="6"
      borderRadius="15px"
      border="0.5px solid rgba(255, 255, 255, 0.2)"
      gap="4"
      justifyContent="center"
      alignItems="center"
      background="rgba(0, 0, 0, 0.3)"
    >
      <Flex gap="4">
        {/* {wsDetails.role === "MASTER" && ( */}
          {/* <> */}
            {/* <WsButton>시작지점 설정</WsButton> */}
            {/* <WsButton>종료지점 설정</WsButton> */}
            {/* <WsButton>설정 리셋</WsButton>
            <SessionUploadButton workspaceSeq={workspaceSeq} />
          </> */}
        {/* // )} */}

        <WsButton>설정 리셋</WsButton>
        <SessionUploadButton workspaceSeq={workspaceSeq} />

      </Flex>
    </Stack>
  );
}
