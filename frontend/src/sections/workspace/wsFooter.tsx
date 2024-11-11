import { Stack, Flex } from "@chakra-ui/react";
import Play from "./play";
import ButtonBox from "./buttonBox";
import { useWsDetailStore } from "@/stores/wsDetailStore";

interface WsFooterProps {
  wsDetails: {
    name: string;
    originTitle: string;
    originSinger: string;
    role: string;
    state: string;
  };
  workspaceSeq: number; // workspaceSeq를 props로 추가
}

export default function WsFooter({ wsDetails, workspaceSeq }: WsFooterProps) {
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

  return (
    <Stack>
      <Flex justifyContent="space-between">
        <Play
          isPlaying={isPlaying} // 전체 재생 상태 전달
          onPlayPause={handlePlayPause} // 전체 재생 및 일시정지 함수 전달
          onStop={stopAll} // 전체 정지 함수 전달
          mode="all" // 전체 모드로 설정
        />
        <ButtonBox wsDetails={wsDetails} workspaceSeq={workspaceSeq} />
      </Flex>
    </Stack>
  );
}
