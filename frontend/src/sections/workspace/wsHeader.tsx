import { Text, Stack, Flex, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import ForkButton from "@/components/workspace/forkButton";
import { useState } from "react";
import axios from "axios";

interface WsHeaderProps {
  wsDetails: {
    name: string;
    originTitle: string;
    originSinger: string;
    state: string;
    updatedAt: string;
  };
  workspaceSeq: number;
  role: string;
}

export default function WsHeader({
  wsDetails,
  workspaceSeq,
  role,
}: WsHeaderProps) {
  const [isPublic, setIsPublic] = useState(wsDetails.state === "PUBLIC");

  const API_URL = import.meta.env.VITE_API_URL;

  const toggleState = async () => {
    const newState = isPublic ? "PRIVATE" : "PUBLIC";
    try {
      await axios.post(
        `${API_URL}/api/workspaces/${workspaceSeq}/state`,
        { state: newState },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setIsPublic(!isPublic); // 상태 토글
    } catch (error) {
      console.error("Error updating workspace state:", error);
      alert("상태 업데이트에 실패했습니다.");
    }
  };

  // 날짜 포맷팅 (YYYY-MM-DD HH:MM)
  const formattedDate = new Date(wsDetails.updatedAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Stack>
      <Flex justifyContent="space-between">
        <Stack>
          <Heading fontFamily="MiceGothic" size="xl">
            {wsDetails.name || "제목 없음"}
          </Heading>
          <Heading fontFamily="MiceGothic" size="md">
            {wsDetails.originTitle || "제목 없음"} -{" "}
            {wsDetails.originSinger || "아티스트 없음"}
          </Heading>
          {role === "MASTER" && (
            <Text fontSize="sm" color="gray.400" mt={1}>
              최종 저장일시 : {formattedDate}
            </Text>
          )}
        </Stack>
        <Flex gap={1.5}>
          {role === "MASTER" ? (
            <>
              <Button
                bg="blackAlpha.900" // 검은 배경
                color="white" // 텍스트 색상
                border="1.5px solid" // 테두리 두께
                borderColor="purple.700" // 보라색 테두리
                borderRadius={13} // 모서리 둥글게
                _hover={{ bg: "purple.700" }} // 호버 효과
                _active={{ bg: "purple.800" }} // 클릭 효과
                paddingX="4"
                paddingY="2"
                width="60px"
                height="40px"
                fontWeight="bold"
              >
                저장
              </Button>
              <Button
                bg="blackAlpha.900" // 검은 배경
                color="white" // 텍스트 색상
                border="1.5px solid" // 테두리 두께
                borderColor="purple.700" // 보라색 테두리
                borderRadius={13} // 모서리 둥글게
                _hover={{ bg: "purple.700" }} // 호버 효과
                _active={{ bg: "purple.800" }} // 클릭 효과
                paddingX="4"
                paddingY="2"
                width="60px"
                height="40px"
                fontWeight="bold"
                onClick={toggleState}
              >
                {isPublic ? "비공개" : "공유"}
              </Button>
            </>
          ) : (
            <ForkButton workspaceSeq={workspaceSeq} />
          )}
        </Flex>
      </Flex>
    </Stack>
  );
}
