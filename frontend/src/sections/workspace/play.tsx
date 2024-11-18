import { IconButton, Flex, Stack, Image, Text } from "@chakra-ui/react";
import { useWsDetailStore } from "@/stores/wsDetailStore";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

interface PlayProps {
  isPlaying: boolean;
  onPlayPause: (playMode: "all" | "individual") => void;
  onStop: (playMode: "all" | "individual") => void;
  mode: "all" | "individual";
  playWidth: string;
  playHeight: string;
}

export default function Play({
  isPlaying,
  onPlayPause,
  onStop,
  mode,
  playWidth,
  playHeight,
}: PlayProps) {
  const setCheck = useWsDetailStore((state) => state.setCheck);
  const sessions = useWsDetailStore((state) => state.sessions);
  const isAllChecked = useWsDetailStore((state) => state.isAllChecked); // 전체 선택 상태

  // 전체 선택 상태 동기화
  useEffect(() => {
    const allSessions = Object.keys(sessions);
    const allChecked =
      allSessions.length > 0 && allSessions.every((id) => sessions[id]?.check);
  }, [sessions]);

  // 전체 선택 핸들러
  const handleAllCheck = (isChecked: boolean) => {
    const allSessionIds = Object.keys(sessions);
    allSessionIds.forEach((sessionId) => {
      setCheck(sessionId, isChecked);
    });
  };

  return (
    <Stack
      // direction="row"
      bg="gray.800"
      padding="6"
      borderRadius="15px"
      border="0.5px solid rgba(255, 255, 255, 0.2)"
      gap="4"
      justifyContent="center"
      alignItems="center"
      background="rgba(0, 0, 0, 0.3)"
      width={playWidth}
      height={playHeight}
    >
      {mode === "all" && (
        <Flex border="0px solid rgba(255, 255, 255, 0.2)" padding="1">
          <Checkbox
            colorPalette="purple"
            checked={isAllChecked}
            onChange={(e) => handleAllCheck(e.target.checked)}
            cursor="pointer"
          />
          <Text ml={3}>전체 선택</Text>
        </Flex>
      )}
      <Flex gap="4" justifyContent="center">
        <IconButton
          bg="blackAlpha.900"
          border="2px solid"
          borderColor="teal.700"
          borderRadius="md"
          _hover={{ bg: "teal.700" }}
          _active={{ bg: "teal.800" }}
          aria-label={isPlaying ? "일시정지" : "재생"}
          colorScheme="teal"
          color="white"
          onClick={onPlayPause}
          width="46px"
          height="46px"
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
          bg="blackAlpha.900"
          border="2px solid"
          borderColor="red.700"
          borderRadius="md"
          _hover={{ bg: "red.700" }}
          _active={{ bg: "red.800" }}
          aria-label="정지"
          colorScheme="red"
          color="white"
          onClick={onStop}
          width="46px"
          height="46px"
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
