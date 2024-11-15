import { Stack, Flex, Box, Text } from "@chakra-ui/react";
import { Slider } from "@/components/ui/slider";
import Play from "./play";
import ButtonBox from "./buttonBox";
import ForkButton from "@/components/workspace/forkButton";
import { useWsDetailStore } from "@/stores/wsDetailStore";
import { useState } from "react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
            재생 바
            <Slider width="90%" defaultValue={[30, 60]} />
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

            {/* 오버레이 레이어 */}
            {/* <Box
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
            /> */}
            {/* 클릭 시 보여줄 메시지 */}
            {/* {showOverlay && (
              <Box
                position="absolute"
                top="20%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="white"
                color="blue"
                py={7}
                px={10}
                borderRadius={12}
                textAlign="center"
              >
                <Text fontSize="14px" mb={4}>
                  추가 작업을 원하시면 해당 워크스페이스를 포크 떠주세요.
                </Text>
                <ForkButton workspaceSeq={workspaceSeq} />
              </Box>
            )} */}
          </>
        )}
      </Flex>
    </Stack>
  );
}
