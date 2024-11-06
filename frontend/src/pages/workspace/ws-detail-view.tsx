import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import SessionBox from "@/sections/workspace/sessionBox";
import ButtonBox from "@/sections/workspace/buttonBox";
import Play from "@/sections/workspace/play";
import { useWsDetailStore } from "@/stores/wsDetailStore";

export default function WsDetailView() {
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
    <Stack padding={4} color="white" borderRadius="md">
      <Flex justifyContent="space-between">
        <Stack>
          <Text>APT. _ EmptyWatermelon.mp3</Text>
          <Text fontSize="sm" color="gray.400">
            최종 저장일시: 2024-10-24 23:10
          </Text>
        </Stack>
        <Flex>
          <Button>저장</Button>
          <Button>공유</Button>
        </Flex>
      </Flex>

      <SessionBox />
      <Flex justifyContent="space-between">
        <Play
          isPlaying={isPlaying} // 전체 재생 상태 전달
          onPlayPause={handlePlayPause} // 전체 재생 및 일시정지 함수 전달
          onStop={stopAll} // 전체 정지 함수 전달
          mode="all" // 전체 모드로 설정
        />
        <ButtonBox />
      </Flex>
    </Stack>
  );
}
