import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import SessionBox from "@/sections/workspace/sessionBox";
import { useParams } from "react-router-dom";
import WsHeader from "@/sections/workspace/wsHeader";
import WsFooter from "@/sections/workspace/wsFooter";
import { useWsDetailStore } from "@/stores/wsDetailStore";
import { useLocation } from "react-router-dom"

interface Sound {
  soundSeq: number;
  startPoint: number;
  endPoint: number;
  // 필요한 다른 필드도 추가할 수 있습니다.
}

export default function WsDetailView() {
  const sessions = useWsDetailStore((state) => state.sessions)
  const setSessions = useWsDetailStore((state) => state.setSessions);
  const resetStore = useWsDetailStore((state) => state.resetStore);
  const globalStartPoint = useWsDetailStore((state) => state.globalStartPoint);
  const globalEndPoint = useWsDetailStore((state) => state.globalEndPoint);
  const globalDuration = useWsDetailStore((state) => state.globalDuration);
  const location = useLocation();

  const [wsDetails, setWsDetails] = useState<{
    name: string;
    originTitle: string;
    originSinger: string;
    role: string;
    state: string; // 추가된 state 필드
    sounds: Sound[];
    updatedAt: string;
    thumbnail: string;
  }>({
    name: "",
    originTitle: "",
    originSinger: "",
    role: "",
    state: "", // 기본값 설정
    sounds: [], // 세션 데이터를 초기 상태로 설정
    updatedAt: "",
    thumbnail: "",
  });

  const shouldReloadSessionBox = useWsDetailStore(
    (state) => state.shouldReloadSessionBox
  );

  // API URL 설정
  const API_URL = import.meta.env.VITE_API_URL;

  const { workspaceSeq } = useParams<{ workspaceSeq: string }>();
  const workspaceSeqNumber = workspaceSeq
    ? parseInt(workspaceSeq, 10)
    : undefined;

  useEffect(() => {
    const fetchWorkspaceDetail = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/workspaces/${workspaceSeq}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        setSessions(response.data.sounds);
        setWsDetails(response.data);

      } catch (error) {
        console.error("Error fetching workspace details:", error);
      }
    };

    if (workspaceSeq) {
      fetchWorkspaceDetail();
    }
  }, [workspaceSeq, setSessions, shouldReloadSessionBox]);

  // 페이지 이동 시 resetStore 호출
  useEffect(() => {
    return () => {
      resetStore(); // 주소가 변경되면 스토어 초기화
    };
  }, [location, resetStore]);

  // 세션 삭제 시 호출되는 핸들러 함수
  const handleSessionDelete = (sessionId: number) => {
    setWsDetails((prevDetails) => ({
      ...prevDetails,
      sounds: prevDetails.sounds.filter(
        (session) => session.soundSeq !== sessionId
      ),
    }));
  };

  return (
    <Stack
      padding={4}
      gap={5}
      color="white"
      borderRadius="md"
      height="100%"
      fontFamily="MiceGothic"
    >
      <WsHeader
        wsDetails={wsDetails}
        workspaceSeq={workspaceSeqNumber}
        role={wsDetails.role}
      />

      <Box flex="1" overflowY="auto">
        <SessionBox
          workspaceSeq={workspaceSeqNumber}
          sessions={wsDetails.sounds}
          onSessionDelete={handleSessionDelete}
          role={wsDetails.role}
        />
      </Box>

      <WsFooter
        wsDetails={wsDetails}
        workspaceSeq={workspaceSeqNumber}
        role={wsDetails.role}
      />
    </Stack>
  );
}
