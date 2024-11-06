import { Box, Stack, Text, Flex, Card } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import ToggleOptions from "./toggleOptions";
import CursorMarker from "./cursorMarker";
import { Checkbox } from "../ui/checkbox";
import Play from "@/sections/workspace/play";
import { useWsDetailStore } from "@/stores/wsDetailStore";

interface SessionProps {
  sessionId: string;
}

export default function Session({ sessionId }: SessionProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); // 현재 재생 중인 시간
  const [cursor1, setCursor1] = useState(0); // 시작 커서 위치
  const [cursor2, setCursor2] = useState(0); // 종료 커서 위치
  const addSession = useWsDetailStore((state) => state.addSession);
  const removeSession = useWsDetailStore((state) => state.removeSession);
  const toggleSession = useWsDetailStore((state) => state.toggleSession);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#FFFFFF",
      progressColor: "lightgrey",
      cursorColor: "green",
      barWidth: 1,
      barHeight: 0.8,
      barGap: 0.5,
      cursorWidth: 2,
      height: 100,
    });

    wavesurferRef.current.load("/DAY6 - Welcome to the Show.mp3");

    wavesurferRef.current.on("ready", () => {
      const audioDuration = wavesurferRef.current?.getDuration() || 0;
      setDuration(audioDuration);
      setCursor2(audioDuration); // 종료 커서를 오디오 길이로 설정
    });

    // 재생 중일 때 시간 업데이트
    wavesurferRef.current.on("audioprocess", () => {
      const currentTime = wavesurferRef.current?.getCurrentTime() || 0;
      setCurrentTime(currentTime);
    });

    // 정지 상태에서 seek 이벤트로 재생 위치 변경 시 시간 업데이트
    wavesurferRef.current.on("seek", () => {
      const newTime = wavesurferRef.current?.getCurrentTime() || 0;
      setCurrentTime(newTime); // 변경된 재생 위치를 현재 시간으로 설정
    });

    // 파형 클릭 시 위치 반영
    const updateCurrentTimeOnClick = () => {
      const newTime = wavesurferRef.current?.getCurrentTime() || 0;
      setCurrentTime(newTime);
    };
    waveformRef.current.addEventListener("click", updateCurrentTimeOnClick);

    addSession(sessionId, wavesurferRef.current);

    return () => {
      removeSession(sessionId);
      wavesurferRef.current?.destroy();
      waveformRef.current?.removeEventListener(
        "click",
        updateCurrentTimeOnClick
      );
    };
  }, [sessionId, addSession, removeSession]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play(cursor1, cursor2);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      setIsPlaying(false);
      setCurrentTime(0); // 정지 시 현재 시간 초기화
    }
  };

  // 시간 형식 함수
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Card.Root bg="transparent" color="white" padding="2" borderColor="grey">
      <Flex gap={3}>
        <Checkbox onChange={() => toggleSession(sessionId)} />
        <Stack justifyContent="center">
          <ToggleOptions />
          <Text fontFamily="MiceGothic" fontSize={11}>
            원곡 : APT.
          </Text>
          <Text fontFamily="MiceGothic" fontSize={11}>
            아티스트 : 로제
          </Text>
        </Stack>

        <Box width="100%">
          <Box
            ref={waveformRef}
            width="100%"
            height="100px"
            position="relative"
          >
            <CursorMarker
              position={cursor1} // 시작 커서 위치
              color="green"
              duration={duration}
            />
            <CursorMarker
              position={cursor2} // 종료 커서 위치
              color="red"
              duration={duration}
            />
          </Box>

          {/* 재생 시간 표시 */}
          <Flex justifyContent="space-between">
            <Text fontSize={10}>{formatTime(currentTime)}</Text>{" "}
            <Text fontSize={10}>{formatTime(duration)}</Text>{" "}
          </Flex>
        </Box>

        {/* Play 컴포넌트를 개별 세션용으로 사용 */}
        <Play
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
          mode="individual"
        />
      </Flex>
    </Card.Root>
  );
}
