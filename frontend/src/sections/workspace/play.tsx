import { IconButton, Flex, Stack, Image } from "@chakra-ui/react";
import { useWsDetailStore } from "@/stores/wsDetailStore";

interface PlayProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  mode: "individual" | "all";
}

export default function Play({
  isPlaying,
  onPlayPause,
  onStop,
  mode,
}: PlayProps) {
  const playAll = useWsDetailStore((state) => state.playAll);
  const pauseAll = useWsDetailStore((state) => state.pauseAll);
  const stopAll = useWsDetailStore((state) => state.stopAll);

  const handlePlayPause = () => {
    if (mode === "all") {
      if (isPlaying) {
        pauseAll(); // 전체 일시정지
      } else {
        playAll(); // 전체 재생
      }
    } else {
      onPlayPause(); // 개별 세션 재생/일시정지
    }
  };

  const handleStop = () => {
    if (mode === "all") {
      stopAll();
    } else {
      onStop();
    }
  };

  return (
    <Stack bg="gray.900" padding="4" borderRadius="md">
      <Flex gap="4" justifyContent="center">
        <IconButton
          aria-label={isPlaying ? "일시정지" : "재생"}
          colorScheme="teal"
          color="white"
          onClick={handlePlayPause}
          _hover={{ bg: "teal.700" }}
          width="50px"
          height="50px"
          padding="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src={
              isPlaying
                ? "/assets/workspace/pauseButton.png"
                : "/assets/workspace/playButton.png"
            }
            alt={isPlaying ? "일시정지" : "재생"}
            boxSize="20px"
          />
        </IconButton>

        <IconButton
          aria-label="정지"
          colorScheme="red"
          color="white"
          onClick={handleStop}
          _hover={{ bg: "red.700" }}
          width="50px"
          height="50px"
          padding="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src="/assets/workspace/stopButton.png"
            alt="정지"
            boxSize="20px"
          />
        </IconButton>
      </Flex>
    </Stack>
  );
}
