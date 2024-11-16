import { Text, Stack, Flex, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import ForkButton from "@/components/workspace/forkButton";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { useWsDetailStore } from "@/stores/wsDetailStore";
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

  const sessions = useWsDetailStore((state) => state.sessions)
  const checkedSessions = useWsDetailStore((state) => state.checkedSessions)

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
            "Content-Type": "application/json",
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

  const handleSaveButton = async () => {
    try {
      const storedToken = localStorage.getItem("jwtToken");

      // 체크된 세션 정보만 저장하거나, 체크된 세션이 없으면 모든 세션 저장
      const sessionsToSave = checkedSessions.length
      ? checkedSessions.map((id) => ({
          soundSeq: parseInt(id, 10), // key를 soundSeq로 사용
          startPoint: parseFloat(sessions[id].startPoint), // Double로 변환
          endPoint: parseFloat(sessions[id].endPoint), // Double로 변환
          type: sessions[id].type || "vocal", // type 값이 없다면 기본값 "ETC"으로 설정
        }))
      : Object.entries(sessions).map(([key, value]) => ({
          soundSeq: parseInt(key, 10), // key를 soundSeq로 사용
          startPoint: parseFloat(value.startPoint), // Double로 변환
          endPoint: parseFloat(value.endPoint), // Double로 변환
          type: value.type || "vocal", // type 값이 없다면 기본값 "ETC"으로 설정
        }));

      // const requestBody = {
      //   sessions: sessionsToSave,
      // };


      console.log("sessionsToSave:", sessionsToSave); // 전송 데이터 확인

      await axios.post(
        `${API_URL}/api/workspaces/${workspaceSeq}/point`,
        // requestBody,
        {
          sessions: sessionsToSave,
        },
        // formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            // "Content-Type": "multipart/form-data", // 멀티파트 요청
          },
        }
      );
      toaster.create({
        description: "변경사항 저장이 되었습니다.",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating workspace state:", error);
      toaster.create({
        description: "변경사항 저장에 실패했습니다.",
        type: "error",
      });
    }
  };

  const getWsTree = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/workspaces/${workspaceSeq}/tree`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      console.log('족보 :', response.data);
      toaster.create({
        description: "데이터 업로드가 완료 되었습니다.",
        type: "success",
      });
    } catch (error) {
      console.error("Error fetching workspace details:", error);
      toaster.create({
        description: "데이터 업로드에 실패했습니다.",
        type: "error",
      });
    }
  };

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
                onClick={handleSaveButton}
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
                onClick={getWsTree}
              >
                더보기
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
