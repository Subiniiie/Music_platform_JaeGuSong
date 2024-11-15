import { Text, Stack, Flex } from "@chakra-ui/react";
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
  };
  workspaceSeq: number;
  role: string;
}

export default function WsHeader({ wsDetails, workspaceSeq, role }: WsHeaderProps) {
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

  return (
    <Stack>
      <Flex justifyContent="space-between">
        <Stack>
          <Text>{wsDetails.name || "제목 없음"}</Text>
          <Text>
            {wsDetails.originTitle || "제목 없음"} -{" "}
            {wsDetails.originSinger || "아티스트 없음"}
          </Text>
          {role === "MASTER" && (
            <Text fontSize="sm" color="gray.400">
              최종 저장일시: 2024-10-24 23:10
            </Text>
          )}
        </Stack>
        <Flex>
          {role === "MASTER" ? (
            <>
              <Button>저장</Button>
              <Button onClick={toggleState}>{isPublic ? "비공개" : "공유"}</Button>
            </>
          ) : (
            <ForkButton />
          )}
        </Flex>
      </Flex>
    </Stack>
  );
}
