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
    <Stack direction="row" bg="gray.800" padding="4" borderRadius="md" gap="4">
      <Flex gap="2">
        {wsDetails.role === "MASTER" && (
          <>
            <WsButton>시작지점 설정</WsButton>
            <WsButton>종료지점 설정</WsButton>
            <WsButton>설정내역 리셋</WsButton>
            <SessionUploadButton workspaceSeq={workspaceSeq} />
          </>
        )}
      </Flex>
    </Stack>
  );
}
