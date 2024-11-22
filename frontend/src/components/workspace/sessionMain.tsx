import { Box, Stack, Text, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import SessionCursor from "./sessionCursor";
import { Rnd } from "react-rnd";
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
  const [cursor3, setCursor3] = useState(globalStartPoint); // 종료 커서 위치
  const [cursor4, setCursor4] = useState(globalEndPoint); // 종료 커서 위치
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [dragOffset, setDragOffset] = useState(0); // 드래그 오프셋
  const [playStartPoint, setPlayStartPoint] = useState(initialStartPoint); // 재생용 시작점
  const [playEndPoint, setPlayEndPoint] = useState(initialEndPoint); // 재생용 종료점

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
  const updateDragOffset = useWsDetailStore((state) => state.updateDragOffset);
  const recalculateGlobalPoints = useWsDetailStore(
    (state) => state.recalculateGlobalPoints
  );
  const offset = useWsDetailStore((state) => state.offsetArray[sessionId]);

  // startPoint, endPoint - 재렌더링 방지
  const startPointRef = useRef(
    storeStartPoint !== 0 ? storeStartPoint : initialStartPoint
  );
  const endPointRef = useRef(
    storeEndPoint !== 0 ? storeEndPoint : initialEndPoint
  );

  const waveformWidth =
    globalDuration !== 0 && duration !== 0
      ? (duration / globalDuration) * 100
      : 100;

  const { handleStartCursorDragStop, handleEndCursorDragStop } = useSession({
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

  const handleDragStart = () => {};

  const handleDrag = (e: MouseEvent, data: { deltaX: number }) => {
    if (!waveformRef.current) return;

    const offset = (data.deltaX / waveformRef.current.clientWidth) * duration;
    setDragOffset(offset); // 오프셋 업데이트
  };

  const handleDragStop = (e: MouseEvent, data: { x: number }) => {
    if (!waveformRef.current) return;

    const offset = (data.x / waveformRef.current.clientWidth) * duration;

    // Store에 offset 저장
    useWsDetailStore.getState().setOffset(sessionId, offset);

    // 플레이 포인트 재계산
    useWsDetailStore.getState().recalculateGlobalPoints();
  };

  useEffect(() => {
    if (globalStartPoint !== undefined) {
      setCursor3(globalStartPoint); // Store 값 변경 시 cursor2 업데이트
    }
    console.log("Updated globalStartPoint:", globalStartPoint);
  }, [globalStartPoint]);

  useEffect(() => {
    if (globalEndPoint !== undefined) {
      setCursor4(globalEndPoint); // Store 값 변경 시 cursor2 업데이트
    }
  }, [globalEndPoint]);

  return (
    <Flex flex={1} align="center">
      <Stack
        width="100%"
        height="110px"
        justify="center"
        position="relative"
        mr="12px"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          pointerEvents="none" // 드래그 이벤트가 여기에 영향을 주지 않도록 설정
        >
          <SessionCursor
            positionX={
              waveformRef.current && globalDuration > 0
                ? ((cursor3 - offset) / globalDuration) *
                  waveformRef.current.clientWidth
                : 0
            }
            color="grey"
            isDraggable={false}
            cursor="not-allowed"
          />
          <SessionCursor
            positionX={
              waveformRef.current && globalDuration > 0
                ? ((cursor4 - offset) / globalDuration) *
                  waveformRef.current.clientWidth
                : 0
            }
            color="grey"
            isDraggable={false}
            cursor="not-allowed"
          />
        </Box>
        <Rnd
          bounds="parent"
          enableResizing={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragStop={handleDragStop}
          size={{ width: `${waveformWidth}%`, height: "100%" }}
          axis="x" // 드래그를 가로(X축)로만 제한
          style={{
            position: "relative", // Rnd 내부 위치를 부모 요소 기준으로 설정
            backgroundColor: "transparent",
            cursor: waveformWidth < 100 ? "move" : "default",
            justify: "center",
          }}
          disableDragging={waveformWidth === 100} // 조건부로 드래그 비활성화
        >
          <Stack
            width="100%"
            onClick={() => console.log("둘째 Stack", waveformWidth)}
          >
            <Box
              ref={waveformRef}
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
            </Box>

            <Flex justifyContent="space-between" width="100%">
              <Text fontSize={10}>{formatTime(currentTime)}</Text>
              <Text fontSize={10}>{formatTime(duration)}</Text>
            </Flex>
          </Stack>
        </Rnd>
      </Stack>
    </Flex>
  );
}
