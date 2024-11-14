import { Stack, Flex, Box, Text } from "@chakra-ui/react";
import Play from "./play";
import ButtonBox from "./buttonBox";
import ForkButton from "@/components/workspace/forkButton";
import { useWsDetailStore } from "@/stores/wsDetailStore";
import { useState } from "react";

interface WsFooterProps {
  wsDetails: {
    name: string;
    originTitle: string;
    originSinger: string;
    role: string;
    state: string;
  };
  workspaceSeq: number;
  role: string;
}

export default function WsFooter({ wsDetails, workspaceSeq, role }: WsFooterProps) {
  // Zustand store에서 전체 재생 및 정지 제어를 위한 상태와 함수 가져오기
  const isPlaying = useWsDetailStore((state) => state.isPlaying);
  const playAll = useWsDetailStore((state) => state.playAll);
  const pauseAll = useWsDetailStore((state) => state.pauseAll);
  const stopAll = useWsDetailStore((state) => state.stopAll);

  // 전체 재생 및 일시정지 제어 함수
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAll(); // 전체 일시정지
    } else {
      playAll(); // 전체 재생
    }
  };

  // VIEWER 전용 메시지와 오버레이 상태 관리
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <Stack>
      <Flex justifyContent="space-between" position="relative">
        <Play
          isPlaying={isPlaying} // 전체 재생 상태 전달
          onPlayPause={handlePlayPause} // 전체 재생 및 일시정지 함수 전달
          onStop={stopAll} // 전체 정지 함수 전달
          mode="all" // 전체 모드로 설정
        />
        <ButtonBox wsDetails={wsDetails} workspaceSeq={workspaceSeq} />

        {role === "VIEWER" && (
          <>
            {/* 오버레이 레이어 */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              background="rgba(0, 0, 0, 0.5)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => setShowOverlay(true)}
            />
            {/* 클릭 시 보여줄 메시지 */}
            {showOverlay && (
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="white"
                color="red"
                padding="4"
                borderRadius="md"
                textAlign="center"
              >
                <Text>추가 작업을 원하시면 해당 워크스페이스를 포크 떠주세요.</Text>
                <ForkButton />
              </Box>
            )}
          </>
        )}
      </Flex>
    </Stack>
  );
}
