import WsButton from "@/components/workspace/wsButton";
import { Button, Flex, Stack } from "@chakra-ui/react";
import SessionUploadButton from "./sessionUploadButton";
import { toaster } from "@/components/ui/toaster";
import useAuthStore from "@/stores/authStore";
import axios from "axios";


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
  // zustand에서 artistSeq 불러오기
  // const artistSeq = useAuthStore((state) => state.artistSeq);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleForkWs = async () => {
    console.log('포크 떠가는 api 요청, handleForkWs 실행시켜볼게')

    try {
      const storedToken = localStorage.getItem("jwtToken");

      const response = await axios.get(
        `${API_URL}/api/workspaces/${workspaceSeq}/fork`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toaster.create({
        description: "내 워크스페이스에 성공적으로 추가되었습니다.",
        type: "success",
      });

    } catch (error) {
      console.error("Error fork workspace:", error);
      toaster.create({
        description: "포크 뜨기에 실패했습니다.",
        type: "error",
      });
    }
  }



  return (
    <Stack direction="row" bg="gray.800" padding="4" borderRadius="md" gap="4">
      <Flex gap="2">
        {wsDetails.role === "MASTER" && (
          <>
            <WsButton>시작지점 설정</WsButton>
            <WsButton>종료지점 설정</WsButton>
            <WsButton>설정내역 리셋</WsButton>
            <SessionUploadButton workspaceSeq={workspaceSeq} />
          {/* <WsButton onClick={() => console.log("워크스페이스 포크 버튼 클릭")}>온클릭 테스트</WsButton> */}
          {/* <Button onClick={handleForkWs}>워크스페이스 포크</Button> */}

          </>
        )}
        {wsDetails.role === "VIEWER" && (
          <Button onClick={handleForkWs}>워크스페이스 포크</Button>
        )}
      </Flex>
    </Stack>
  );
}
