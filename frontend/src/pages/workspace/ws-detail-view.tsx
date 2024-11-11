import { Image, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import SessionBox from "@/sections/workspace/sessionBox";
import { useParams } from "react-router-dom";
import WsHeader from "@/sections/workspace/wsHeader";
import WsFooter from "@/sections/workspace/wsFooter";

export default function WsDetailView() {
  // const [wsDetails, setWsDetails] = useState<{
  const [wsDetails, setWsDetails] = useState({
    name: "",
    originTitle: "",
    originSinger: "",
    role: "",
    // sounds?: { soundSeq: number; startPoint: number; endPoint: number; type: string; url: string }[];
    sounds: [], // 세션 데이터를 초기 상태로 설정
    thumbnail: "",
  // }>({});
  });
  // const [sessions, setSessions] = useState(wsDetails.sounds || []);

  // API URL 설정
  const API_URL = import.meta.env.VITE_API_URL;

  const { workspaceSeq } = useParams<{ workspaceSeq: string }>();

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
        console.log("Workspace Details:", response.data);
        setWsDetails(response.data);
        // setSessions(response.data.sounds || []); // 세션 목록 초기화

      } catch (error) {
        console.error("Error fetching workspace details:", error);
      }
    };

    if (workspaceSeq) {
      fetchWorkspaceDetail();
    }
  }, [workspaceSeq, API_URL]);

  // 세션 삭제 시 호출되는 핸들러 함수
  const handleSessionDelete = (sessionId) => {
    setWsDetails((prevDetails) => ({
      ...prevDetails,
      sounds: prevDetails.sounds.filter((session) => session.soundSeq !== sessionId),
    }));
  };

  return (
    <Stack padding={4} color="white" borderRadius="md">
      <WsHeader wsDetails={wsDetails} workspaceSeq={workspaceSeq} />

      <Image src={wsDetails.thumbnail} />
      {/* <Image src="https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/"/> */}

      <SessionBox
        workspaceSeq={workspaceSeq}
        sessions={wsDetails.sounds}
        onSessionDelete={handleSessionDelete}
      />

      <WsFooter wsDetails={wsDetails} workspaceSeq={workspaceSeq} />
    </Stack>
  );
}
