import { Stack, Flex, Box, Text } from "@chakra-ui/react";
import { Slider } from "@/components/ui/slider";
import Play from "./play";
import ButtonBox from "./buttonBox";
import ForkButton from "@/components/workspace/forkButton";
import { useWsDetailStore } from "@/stores/wsDetailStore";
import { useEffect, useState } from "react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { WsGlobalSlider } from "./wsGlobalSlider";

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

export default function WsFooter({
  wsDetails,
  workspaceSeq,
  role,
}: WsFooterProps) {
  // Zustand store에서 전체 재생 및 정지 제어를 위한 상태와 함수 가져오기
  const isPlaying = useWsDetailStore((state) => state.isPlaying);
  const playAll = useWsDetailStore((state) => state.playAll);
  const pauseAll = useWsDetailStore((state) => state.pauseAll);
  const stopAll = useWsDetailStore((state) => state.stopAll);

  const globalStartPoint = useWsDetailStore((state) => state.globalStartPoint);
  const globalEndPoint = useWsDetailStore((state) => state.globalEndPoint);
  const globalDuration = useWsDetailStore((state) => state.globalDuration);
  const sessions = useWsDetailStore((state) => state.sessions);

  // 전체 재생 및 일시정지 제어 함수
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAll(); // 전체 일시정지
    } else {
      playAll(); // 전체 재생
    }
  };

  const formatSecondsToMinutes = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`; // 예: 1:05
  };

  useEffect(() => {
    return () => {
      console.log('globalStartPoint', globalStartPoint)
      console.log('sessions', sessions)
    };
  }, []);

  return (
    <Stack>
      <Flex justifyContent="space-between" position="relative" gap="16px">
        <Play
          isPlaying={isPlaying} // 전체 재생 상태 전달
          onPlayPause={handlePlayPause} // 전체 재생 및 일시정지 함수 전달
          onStop={stopAll} // 전체 정지 함수 전달
          mode="all" // 전체 모드로 설정
        />

        <Stack
          direction="row"
          bg="gray.800"
          padding="6"
          borderRadius="15px"
          border="0.5px solid rgba(255, 255, 255, 0.2)"
          gap="4"
          justifyContent="center"
          alignItems="center"
          background="rgba(0, 0, 0, 0.3)"
          flex="1"
        >
          <Flex gap="4" justifyContent="center" width="100%">
            <Stack width="100%">
              <Text>전체 재생 컨트롤</Text>
              <Text truncate color="purple.100" fontSize="13px">전체 재생 시작 지점과 종료 지점을 설정해주세요.</Text>
              <WsGlobalSlider
                width="100%"
                defaultValue={[globalStartPoint, globalEndPoint]}
                min={0}
                max={globalDuration}
                marks={[
                  { value: globalStartPoint, label: formatSecondsToMinutes(globalStartPoint) }, // Start를 분:초로 표시
                  { value: globalEndPoint, label: formatSecondsToMinutes(globalEndPoint) },   // End를 분:초로 표시
                ]}
                onClick={(e) => console.log(globalDuration)}
              />
            </Stack>
          </Flex>
        </Stack>

        <ButtonBox wsDetails={wsDetails} workspaceSeq={workspaceSeq} />

        {role === "VIEWER" && (
          <>
            <PopoverRoot>
              <PopoverTrigger asChild>
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
                />
              </PopoverTrigger>
              <PopoverContent borderRadius={12}>
                <PopoverArrow />
                <PopoverBody
                  bg="white"
                  color="blue"
                  py={7}
                  px={10}
                  textAlign="center"
                  borderRadius={12}
                >
                  <Text fontSize="14px" mb={1}>
                    추가 작업을 원하시면
                  </Text>
                  <Text fontSize="14px" mb={4}>
                    해당 워크스페이스를 포크 떠주세요.
                  </Text>
                  <ForkButton workspaceSeq={workspaceSeq} />
                  {/* </Box> */}
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
          </>
        )}
      </Flex>
    </Stack>
  );
}
