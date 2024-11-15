// ForkButton.tsx
import { Button } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import axios from "axios";

interface ForkButtonProps {
  workspaceSeq: number;
}

export default function ForkButton({ workspaceSeq }: ForkButtonProps) {
  const API_URL = import.meta.env.VITE_API_URL;

  const handleForkWs = async () => {
    console.log("포크 떠가는 api 요청, handleForkWs 실행시켜볼게");

    try {
      const storedToken = localStorage.getItem("jwtToken");

      await axios.get(`${API_URL}/api/workspaces/${workspaceSeq}/fork`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
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
  };

  return (
    <Button
      bg="blackAlpha.900" // 검은 배경
      color="white" // 텍스트 색상
      border="2px solid" // 테두리 두께
      borderColor="purple.500" // 보라색 테두리
      borderRadius={13} // 모서리 둥글게
      _hover={{ bg: "purple.700" }} // 호버 효과
      _active={{ bg: "purple.800" }} // 클릭 효과
      paddingX="4"
      paddingY="2"
      width="140px"
      height="40px"
      fontWeight="bold"
      onClick={handleForkWs}
    >
      워크스페이스 포크
    </Button>
  );
}
