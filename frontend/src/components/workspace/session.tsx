import axios from "axios";
import { Box, Stack, Text, Flex, Card, Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import ToggleOptions from "./toggleOptions";
// import CursorMarker from "./cursorMarker";
import { Checkbox } from "../ui/checkbox";
import Play from "@/sections/workspace/play";
import { toaster } from "@/components/ui/toaster";
import { useWsDetailStore } from "@/stores/wsDetailStore";
import { Rnd } from "react-rnd";

interface SessionProps {
  sessionId: string;
  url: string;
  type: string;
  startPoint: number;
  endPoint: number;
  workspaceSeq: number; // workspaceSeq를 props로 추가
  onSessionDelete: (sessionId: string) => void; // 삭제 핸들러 추가
}

export default function Session({
  sessionId,
  url,
  type,
  startPoint: initialStartPoint,
  endPoint: initialEndPoint,
  workspaceSeq,
  onSessionDelete,
}: SessionProps & { onSessionDelete: (sessionId: number) => void }) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  // startPoint, endPoint
  const [startPoint, setStartPoint] = useState(initialStartPoint);
  const [endPoint, setEndPoint] = useState(initialEndPoint);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [cursor1, setCursor1] = useState(initialStartPoint); // 시작 커서 위치
  const [cursor2, setCursor2] = useState(initialEndPoint); // 종료 커서 위치

  // 상태 관리 및 store 관련
  const addSession = useWsDetailStore((state) => state.addSession);
  const removeSession = useWsDetailStore((state) => state.removeSession);
  const toggleSession = useWsDetailStore((state) => state.toggleSession);
  const API_URL = import.meta.env.VITE_API_URL;

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

    wavesurferRef.current.load(url);

    // ready | When the audio is both decoded and can play
    wavesurferRef.current.on("ready", () => {
      const audioDuration = wavesurferRef.current?.getDuration() || 0;
      setDuration(audioDuration); // duration 에 오디오 길이 상태 업데이트
      setCursor2(endPoint || audioDuration); // 종료 커서를 endPoint 또는 오디오 길이로 설정
    });

    // audioprocess | An alias of timeupdate but only when the audio is playing
    wavesurferRef.current.on("audioprocess", () => {
      const currentTime = wavesurferRef.current?.getCurrentTime() || 0;
      console.log("재생 중 | 현재 currentTime :", currentTime);

      if (currentTime > endPoint) {
        wavesurferRef.current?.stop();
        wavesurferRef.current?.setTime(startPoint);
        setCurrentTime(startPoint);
      } else {
        setCurrentTime(currentTime); // currentTime 에 새로 찾은 위치 상태 업데이트
      }
    });

    wavesurferRef.current.on("interaction", () => {
      const newTime = wavesurferRef.current?.getCurrentTime() || 0;
      console.log("interaction 발생! newTime :", newTime);

      if (newTime < startPoint || newTime > endPoint) {
        wavesurferRef.current?.setTime(startPoint);
        setCurrentTime(startPoint);
      } else {
        wavesurferRef.current?.setTime(newTime); // wavesurferRef.current 에 새로 찾은 위치 상태 업데이트
        setCurrentTime(newTime); // currentTime 에 새로 찾은 위치 상태 업데이트
      }
    });

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
  }, [sessionId, addSession, removeSession, url, startPoint, endPoint]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        setCurrentTime(cursor1);
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleDeleteSession = async () => {
    console.log("세션 삭제 요청 api 날려볼게");

    try {
      const storedToken = localStorage.getItem("jwtToken");
      await axios.delete(
        `${API_URL}/api/workspaces/${workspaceSeq}/session/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toaster.create({
        description: "세션이 성공적으로 삭제되었습니다.",
        type: "success",
      });

      // onDelete(sessionId); // 삭제 후 부모 컴포넌트의 상태 업데이트
      onSessionDelete(Number(sessionId)); // 부모 컴포넌트에 삭제를 알림
    } catch (error) {
      console.error("Error adding session:", error);
      toaster.create({
        description: "세션 삭제에 실패했습니다.",
        type: "error",
      });
    }
  };

  const handleStartCursorDrag = (e, d) => {
    if (waveformRef.current) {
      // 유효성 검사 추가
      const newCursorTime = (d.x / waveformRef.current.clientWidth) * duration;
      setCursor1(newCursorTime);
    }
  };

  const handleEndCursorDrag = (e, d) => {
    if (waveformRef.current) {
      // 유효성 검사 추가
      const newCursorTime = (d.x / waveformRef.current.clientWidth) * duration;
      setCursor2(newCursorTime);
    }
  };

  const handleStartCursorDragStop = (e, d) => {
    if (waveformRef.current) {
      // 새로운 startPoint 계산
      const newStartPoint = (d.x / waveformRef.current.clientWidth) * duration;
      setCursor1(newStartPoint); // 커서 위치 갱신
      setStartPoint(newStartPoint); // startPoint 상태 업데이트
      console.log("newStartPoint :", newStartPoint);

      // 현재 재생 위치가 새 startPoint보다 이전이라면 위치를 맞춥니다.
      if (currentTime < newStartPoint) {
        wavesurferRef.current?.setTime(newStartPoint);
      }
    }
  };

  const handleEndCursorDragStop = (e, d) => {
    if (waveformRef.current) {
      // 새로운 endPoint 계산
      const newEndPoint = (d.x / waveformRef.current.clientWidth) * duration;
      setCursor2(newEndPoint); // 커서 위치 갱신
      setEndPoint(newEndPoint); // endPoint 상태 업데이트
      console.log("newEndPoint :", newEndPoint);

      // 현재 재생 위치가 새 endPoint보다 이후라면 재생을 멈추고 위치를 startPoint로 설정합니다.
      if (currentTime > newEndPoint) {
        setIsPlaying(false);
        setCurrentTime(startPoint);
        wavesurferRef.current?.pause();
        wavesurferRef.current?.setTime(startPoint);
      }
    }
  };

  return (
    <Card.Root bg="transparent" color="white" padding="2" borderColor="grey">
      <Flex gap={3}>
        <Checkbox onChange={() => toggleSession(sessionId)} />
        <Stack justifyContent="center">
          <ToggleOptions />
          <Text fontFamily="MiceGothic" fontSize={11}>
            세션 타입 : {type}
          </Text>
        </Stack>

        <Box width="100%">
          <Box
            ref={waveformRef}
            width="100%"
            height="100px"
            position="relative"
          >
            {/* <CursorMarker position={cursor1} color="green" duration={duration} />
            <CursorMarker position={cursor2} color="red" duration={duration} /> */}

            {/* Draggable startPoint 커서 */}
            <Rnd
              bounds="parent"
              size={{ width: 2, height: 100 }}
              position={{
                x:
                  waveformRef.current && duration > 0
                    ? (cursor1 / duration) * waveformRef.current.clientWidth
                    : 0,
                y: 0,
              }}
              onDrag={handleStartCursorDrag}
              onDragStop={handleStartCursorDragStop}
              // style={{ backgroundColor: "green" }}
              style={{ backgroundColor: "transparent", cursor: "pointer" }} // Rnd 자체 배경 제거
              // />
            >
              {/* 커서 모양을 위한 Wrapper */}
              <div
                style={{ position: "relative", height: "100%", width: "100%" }}
              >
                {/* 삼각형 부분 */}
                <div
                  style={{
                    position: "absolute",
                    top: -8, // 바의 위쪽에 삼각형이 위치하도록
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: "10px solid green", // 삼각형 색상
                  }}
                ></div>

                {/* 바 부분 */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "green",
                  }}
                ></div>
              </div>
            </Rnd>

            {/* Draggable endPoint 커서 */}
            <Rnd
              bounds="parent"
              size={{ width: 2, height: 100 }}
              position={{
                x:
                  waveformRef.current && duration > 0
                    ? (cursor2 / duration) * waveformRef.current.clientWidth
                    : 0,
                y: 0,
              }}
              onDrag={handleEndCursorDrag}
              onDragStop={handleEndCursorDragStop}
              // style={{ backgroundColor: "red" }}
              style={{ backgroundColor: "transparent", cursor: "pointer" }} // Rnd 자체 배경 제거
              // />
            >
              {/* 커서 모양을 위한 Wrapper */}
              <div
                style={{ position: "relative", height: "100%", width: "100%" }}
              >
                {/* 삼각형 부분 */}
                <div
                  style={{
                    position: "absolute",
                    top: -8, // 바의 위쪽에 삼각형이 위치하도록
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: "10px solid red", // 삼각형 색상
                  }}
                ></div>

                {/* 바 부분 */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "red",
                  }}
                ></div>
              </div>
            </Rnd>
          </Box>

          <Flex justifyContent="space-between">
            <Text fontSize={10}>{formatTime(currentTime)}</Text>
            <Text fontSize={10}>{formatTime(duration)}</Text>
          </Flex>
        </Box>

        <Play
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
          mode="individual"
        />

        {/* <Button onClick={handleDeleteSession}>삭제</Button> */}
        <Button onClick={handleDeleteSession}>삭제</Button>
      </Flex>
    </Card.Root>
  );
}
