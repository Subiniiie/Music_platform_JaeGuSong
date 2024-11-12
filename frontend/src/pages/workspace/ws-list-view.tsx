import { Box, Stack, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Search from "@/sections/workspace/search";
import CardList from "@/sections/workspace/cardList";
import WsCreateButton from "@/sections/workspace/wsCreateButton";
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";
import useAuthStore from "@/stores/authStore";
import WsPagination from "@/sections/workspace/wsPagination";

export default function WsListView() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // zustand에서 artistSeq 불러오기
  const artistSeq = useAuthStore((state) => state.artistSeq);

  // 워크스페이스 리스트 상태 관리
  const [wsList, setWsList] = useState([]);

  // 워크스페이스 생성 후 navigate 처리를 위한 콜백 함수
  const handleWorkspaceCreated = (workspaceId) => {
    navigate(paths.workspace.detail(workspaceId));
  };

  // wsList를 얻기 위한 API 호출 함수
  const fetchWsList = async (page = 0) => {
    try {
      console.log("워크스페이스 리스트 GET API 요청 보낼게");

      const storedToken = localStorage.getItem("jwtToken");
      console.log("storedToken :", storedToken);
      console.log("artistSeq :", artistSeq);
      const response = await axios.get(
        `${API_URL}/api/artists/${artistSeq}/workspaces`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          params: {
            page: page,
          },
        }
      );
      console.log(response.data);
      setWsList(response.data); // wsList 상태에 저장
    } catch (error) {
      console.error("Error fetching wsList:", error);
      throw error;
    }
  };

  // 페이지 렌더링 시 artistSeq 가져오기
  useEffect(() => {
    console.log("여기는 WsListView, artistSeq 는", artistSeq);
    if (artistSeq) {
      fetchWsList();
    } else {
      console.log("artistSeq 값 없음", artistSeq);
    }
  }, [artistSeq]);

  return (
    <Flex direction="column" height="100%" paddingTop="3" px="5" gap="2">
      <Stack>
        <Flex justify="space-between">
          <Search />

          {/* artistSeq와 생성된 워크스페이스 ID 콜백을 전달 */}
          {artistSeq && (
            <WsCreateButton
              artistSeq={artistSeq}
              onWorkspaceCreated={handleWorkspaceCreated}
            />
          )}
        </Flex>
      </Stack>

      <Box flex="1" overflowY="auto">
        {/* wsList 데이터를 CardList에 props로 전달 */}
        <CardList wsList={wsList} fetchWsList={fetchWsList} />
      </Box>

      <Flex justify="center" position="sticky" bottom="0" p={4}>
        <WsPagination />
      </Flex>
    </Flex>
  );
}