import { Stack, Flex, Box, Text } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import Play from "./play";
import ButtonBox from "./buttonBox";
import ForkButton from "@/components/workspace/forkButton";
import { useWsDetailStore } from "@/stores/wsDetailStore";
import { useEffect, useState, useRef } from "react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WsGlobalSlider } from "./wsGlobalSlider";
import { toaster } from "@/components/ui/toaster";

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
  const isGlobalPlaying = useWsDetailStore((state) => state.isGlobalPlaying);
  const checkedSessions = useWsDetailStore((state) => state.checkedSessions);
  const playAll = useWsDetailStore((state) => state.playAll);
  const pauseAll = useWsDetailStore((state) => state.pauseAll);
  const stopAll = useWsDetailStore((state) => state.stopAll);

  const globalStartPoint = useWsDetailStore((state) => state.globalStartPoint);
  const globalEndPoint = useWsDetailStore((state) => state.globalEndPoint);
  const globalDuration = useWsDetailStore((state) => state.globalDuration);
  const updateGlobalStartPoint = useWsDetailStore(
    (state) => state.updateGlobalStartPoint
  );
  const updateGlobalEndPoint = useWsDetailStore(
    (state) => state.updateGlobalEndPoint
  );

  const handleGlobalPlayPause = () => {
    if (checkedSessions.length === 0) {
      toaster.create({
        description: "재생할 세션을 선택해주세요.",
        type: "error",
      });
      return;
    }

    if (isGlobalPlaying) {
      pauseAll();
    } else {
      playAll();
    }
  };

  const handleStop = () => {
    console.log(
      "안녕, 난 handleStop. 지금 내 mode는 글로벌이야. 여기는 wsFooter."
    );
    stopAll();
  };

  const formatSecondsToMinutes = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`; // 예: 1:05
  };

  const handleSliderChange = ([start, end]: [number, number]) => {
    console.log("안녕 난 handleSliderChange");
    updateGlobalStartPoint(start);
    updateGlobalEndPoint(end);
  };

  const [buttonBoxWidth, setbuttonBoxWidth] = useState(0); // Play 컴포넌트 가로 길이
  const buttonBoxRef = useRef<HTMLDivElement>(null); // Play 컴포넌트의 ref

  useEffect(() => {
    if (buttonBoxRef.current) {
      // Play 컴포넌트의 실제 가로 길이를 가져와서 상태에 저장
      setbuttonBoxWidth(buttonBoxRef.current.offsetWidth);
    }
  }, []);

  const [playHeight, setPlayHeight] = useState(0); // Play 컴포넌트 가로 길이
  const playHeightRef = useRef<HTMLDivElement>(null); // Play 컴포넌트의 ref

  useEffect(() => {
    if (playHeightRef.current) {
      // Play 컴포넌트의 실제 가로 길이를 가져와서 상태에 저장
      setPlayHeight(playHeightRef.current.offsetWidth);
    }
  }, []);

  return (
    <Stack>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        position="relative"
        gap="16px"
      >
        <Stack>
          <Box ref={playHeightRef}>
            <Play
              isPlaying={isGlobalPlaying} // 전체 재생 상태 전달
              onPlayPause={handleGlobalPlayPause} // 전체 재생 및 일시정지 함수 전달
              onStop={handleStop} // 전체 정지 함수 전달
              mode="all" // 전체 모드로 설정
            />
          </Box>
        </Stack>

        {/* <Stack
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
          // mx="6"
        >
          <Flex gap="4" justifyContent="center" width="100%">
            <Stack width="100%">
              <Text>전체 재생 컨트롤</Text>
              <Text truncate color="purple.100" fontSize="13px">
                전체 재생 시작 지점과 종료 지점을 설정해주세요.
              </Text>
              <WsGlobalSlider
                width="100%"
                defaultValue={[globalStartPoint, globalEndPoint]}
                min={0}
                max={globalDuration}
                marks={[
                  {
                    value: globalStartPoint,
                    label: formatSecondsToMinutes(globalStartPoint),
                  }, // Start를 분:초로 표시
                  {
                    value: globalEndPoint,
                    label: formatSecondsToMinutes(globalEndPoint),
                  }, // End를 분:초로 표시
                ]}
                // onChange={handleSliderChange}
                onClick={handleSliderChange}
              />
            </Stack>
          </Flex>
        </Stack> */}

        <Box ref={buttonBoxRef}>
          <ButtonBox
            wsDetails={wsDetails}
            workspaceSeq={workspaceSeq}
            buttonBoxHeight={`${playHeight}px`}
          />
        </Box>

        {role === "VIEWER" && (
          <>
            <PopoverRoot>
              <PopoverTrigger asChild>
                <Box
                  position="absolute"
                  top="0"
                  // left={`${buttonBoxWidth}px`} // Play 컴포넌트의 가로 길이만큼 이동
                  right="0"
                  bottom="0"
                  background="rgba(0, 0, 0, 0.5)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="0.5px solid rgba(255, 255, 255, 0.2)"
                  borderRadius="15px"
                  width={`${buttonBoxWidth}px`}
                ></Box>
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
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
          </>
        )}
      </Flex>
    </Stack>
  );
}
