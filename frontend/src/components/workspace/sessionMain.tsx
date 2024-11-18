import { Box, Stack, Text, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import SessionCursor from "./sessionCursor";
import WaveSurfer from "wavesurfer.js";
import { useWsDetailStore } from "@/stores/wsDetailStore";
import { useSession } from "@/hooks/workspace/useSession";

interface SessionMainProps {
  sessionId: string;
  url: string;
  startPoint: number;
  endPoint: number;
  globalStartPoint: number;
  globalEndPoint: number;
}

export default function SessionMain({
  sessionId,
  url,
  startPoint: initialStartPoint,
  endPoint: initialEndPoint,
  globalStartPoint,
  globalEndPoint,
}: SessionMainProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const [cursor1, setCursor1] = useState(initialStartPoint); // 시작 커서 위치
  const [cursor2, setCursor2] = useState(initialEndPoint); // 종료 커서 위치
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const addSession = useWsDetailStore((state) => state.addSession);
  const storeStartPoint = useWsDetailStore(
    (state) => state.sessions[sessionId]?.startPoint
  );
  const storeEndPoint = useWsDetailStore(
    (state) => state.sessions[sessionId]?.endPoint
  );
  const globalDuration = useWsDetailStore((state) => state.globalDuration);
  const removeSession = useWsDetailStore((state) => state.removeSession);
  const updateStartPoint = useWsDetailStore((state) => state.updateStartPoint);
  const updateEndPoint = useWsDetailStore((state) => state.updateEndPoint);

  // startPoint, endPoint - 재렌더링 방지
  const startPointRef = useRef(
    storeStartPoint !== 0 ? storeStartPoint : initialStartPoint
  );
  const endPointRef = useRef(
    storeEndPoint !== 0 ? storeEndPoint : initialEndPoint
  );

  const waveformWidth = (globalDuration !== 0) && (duration !== 0) ? (duration / globalDuration) * 100 : 100

  const { handleStartCursorDragStop, handleEndCursorDragStop } =
  useSession({
    waveformRef,
    wavesurferRef,
    duration,
    storeStartPoint,
    storeEndPoint,
    sessionId,
    setCursor1,
    setCursor2,
    updateStartPoint,
    updateEndPoint,
  });

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#FFFFFF",
      progressColor: "grey",
      cursorColor: "purple",
      barWidth: 1,
      barHeight: 0.8,
      barGap: 0.5,
      cursorWidth: 2.5,
      height: 100,
      audioRate: 1,
    });

    wavesurferRef.current.load(url);

    // ready | When the audio is both decoded and can play
    wavesurferRef.current.on("ready", () => {
      const audioDuration = wavesurferRef.current?.getDuration() || 0;
      setDuration(audioDuration); // duration 에 오디오 길이 상태 업데이트
      wavesurferRef.current?.setTime(startPointRef.current);
      // setCursor2(endPoint || audioDuration); // 종료 커서를 endPoint 또는 오디오 길이로 설정
      if (endPointRef.current > audioDuration) {
        endPointRef.current = audioDuration;
      }
      addSession(sessionId, wavesurferRef.current);
    });

    wavesurferRef.current.on("interaction", () => {
      const newCurrentTime = wavesurferRef.current?.getCurrentTime() || 0;

      if (
        newCurrentTime < startPointRef.current ||
        newCurrentTime > endPointRef.current
      ) {
        wavesurferRef.current?.setTime(startPointRef.current);
        setCurrentTime(startPointRef.current);
      } else {
        setCurrentTime(newCurrentTime); // currentTime 에 새로 찾은 위치 상태 업데이트
      }
    });

    const updateCurrentTimeOnClick = () => {
      const newTime = wavesurferRef.current?.getCurrentTime() || 0;
      setCurrentTime(newTime);
    };
    waveformRef.current.addEventListener("click", updateCurrentTimeOnClick);

    return () => {
      wavesurferRef.current?.destroy();
      waveformRef.current?.removeEventListener(
        "click",
        updateCurrentTimeOnClick
      );
    };
  }, [sessionId, addSession, removeSession, url]);

  useEffect(() => {
    if (storeStartPoint !== undefined) {
      setCursor1(storeStartPoint); // Store 값 변경 시 cursor1 업데이트
      // currentTime 유효성 검사 및 업데이트
      if (wavesurferRef.current) {
        const currentTime = wavesurferRef.current.getCurrentTime() || 0;
  
        if (currentTime < storeStartPoint) {
          wavesurferRef.current.setTime(storeStartPoint);
          setCurrentTime(storeStartPoint); // currentTime을 startPoint로 업데이트
        }
      }
    }
  }, [storeStartPoint]);
  
  useEffect(() => {
    if (storeEndPoint !== undefined) {
      setCursor2(storeEndPoint); // Store 값 변경 시 cursor2 업데이트
      // currentTime 유효성 검사 및 업데이트
      if (wavesurferRef.current) {
        const currentTime = wavesurferRef.current.getCurrentTime() || 0;
  
        if (currentTime > storeEndPoint) {
          wavesurferRef.current.setTime(storeEndPoint);
          setCurrentTime(storeEndPoint); // currentTime을 endPoint로 업데이트
        }
      }
    }
  }, [storeEndPoint]);
  
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Flex
      flex={1}
      align="center"
    >
      <Stack
        // width="100%"
        width={`${waveformWidth}%`}
        // flex={1}
        height="150px"
        justify="center"
        pt="10px"
        mr="12px"
      >
        <Stack>
          <Box
            ref={waveformRef}
            // width={`${waveformWidth}%`}
            width="100%"
            height="100px"
            position="relative"
          >
            <SessionCursor
              positionX={
                waveformRef.current && duration > 0
                  ? (cursor1 / duration) * waveformRef.current.clientWidth
                  : 0
              }
              color="green"
              onDragStop={handleStartCursorDragStop}
              isDraggable={true}
            />
            <SessionCursor
              positionX={
                waveformRef.current && duration > 0
                  ? (cursor2 / duration) * waveformRef.current.clientWidth
                  : 0
              }
              color="red"
              onDragStop={handleEndCursorDragStop}
              isDraggable={true}
            />
            <SessionCursor
              positionX={
                waveformRef.current && duration > 0
                  ? (globalStartPoint / duration) * waveformRef.current.clientWidth
                  : 0
              }
              color="grey"
              isDraggable={false}
            />
            <SessionCursor
              positionX={
                waveformRef.current && duration > 0
                  ? (globalEndPoint / duration) * waveformRef.current.clientWidth
                  : 0
              }
              color="grey"
              isDraggable={false}
            />
          </Box>

          <Flex justifyContent="space-between" width="100%">
            <Text fontSize={10}>{formatTime(currentTime)}</Text>
            <Text fontSize={10}>{formatTime(duration)}</Text>
          </Flex>
        </Stack>
      </Stack>

      {waveformWidth < 100 && (
        <Stack width={`(${100 - waveformWidth})%`}>
          <Text fontSize={12} color="transparent">.</Text>
        </Stack>
      )}
    </Flex>
  )
}
