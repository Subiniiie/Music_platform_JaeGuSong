import axios from "axios";
import { Box, Stack, Text, Flex, Card, Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import ToggleOptions from "./toggleOptions";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  globalStartPoint: number;
  globalEndPoint: number;
  onSessionDelete: (sessionId: string) => void; // 삭제 핸들러 추가
}

export default function Session({
  sessionId,
  url,
  type,
  startPoint: initialStartPoint,
  endPoint: initialEndPoint,
  workspaceSeq,
  globalStartPoint,
  globalEndPoint,
  onSessionDelete,
}: SessionProps & { onSessionDelete: (sessionId: number) => void }) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  // startPoint, endPoint
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [cursor1, setCursor1] = useState(initialStartPoint); // 시작 커서 위치
  const [cursor2, setCursor2] = useState(initialEndPoint); // 종료 커서 위치

  // startPoint, endPoint - 재렌더링 방지
  const startPointRef = useRef(initialStartPoint);
  const endPointRef = useRef(initialEndPoint);

  // 상태 관리 및 store 관련
  const addSession = useWsDetailStore((state) => state.addSession);
  const removeSession = useWsDetailStore((state) => state.removeSession);
  const toggleCheck = useWsDetailStore((state) => state.toggleCheck);
  const API_URL = import.meta.env.VITE_API_URL;

  // toggleOptions
  const sessionTypeRef = useRef(type);
  const [, forceUpdate] = useState(0); // 이 상태는 재렌더링을 위한 용도로만 사용합니다.
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSelectSession = (value) => {
    sessionTypeRef.current = value;
    forceUpdate((prev) => prev + 1); // 강제로 재렌더링
    setIsPopoverOpen(false); // 선택 후 Popover 닫기
  };

  const handleResetSession = () => {
    sessionTypeRef.current = type;
    forceUpdate((prev) => prev + 1); // 강제로 재렌더링
  };

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
    });

    // audioprocess | An alias of timeupdate but only when the audio is playing
    wavesurferRef.current.on("audioprocess", () => {
      const currentTime = wavesurferRef.current?.getCurrentTime() || 0;
      console.log("재생 중 | 현재 currentTime :", currentTime);

      if (currentTime > endPointRef.current) {
        console.log("종료 지점 지났당!");
        console.log("endPointRef.current :", endPointRef.current);
        wavesurferRef.current?.pause();
        wavesurferRef.current?.setTime(startPointRef.current);
        setCurrentTime(startPointRef.current);
      } else if (currentTime < startPointRef.current) {
        wavesurferRef.current?.setTime(startPointRef.current);
        setCurrentTime(startPointRef.current);
      }
    });

    wavesurferRef.current.on("interaction", () => {
      const newCurrentTime = wavesurferRef.current?.getCurrentTime() || 0;
      console.log("interaction 발생! newCurrentTime :", newCurrentTime);

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

    addSession(sessionId, wavesurferRef.current);

    return () => {
      removeSession(sessionId);   // WsDetailStore 에서 session 정보 제거
      wavesurferRef.current?.destroy();
      waveformRef.current?.removeEventListener(
        "click",
        updateCurrentTimeOnClick
      );
      console.log('useEffect return')
      console.log('globalStartPoint :', globalStartPoint)
      console.log('globalEndPoint :', globalEndPoint)
    };
  }, [sessionId, addSession, removeSession, url]);

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
    console.log("안녕, 난 handleStop");
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      wavesurferRef.current?.setTime(startPointRef.current);
      setIsPlaying(false);
      setCurrentTime(startPointRef.current);
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

      onSessionDelete(Number(sessionId)); // 부모 컴포넌트에 삭제를 알림
    } catch (error) {
      console.error("Error adding session:", error);
      toaster.create({
        description: "세션 삭제에 실패했습니다.",
        type: "error",
      });
    }
  };

  const handleStartCursorDragStop = (e, d) => {
    console.log("안녕 난 handleStartCursorDragStop");

    if (waveformRef.current) {
      const currentTime = wavesurferRef.current?.getCurrentTime() || 0;
      // 새로운 startPoint 계산
      const newStartPoint = (d.x / waveformRef.current.clientWidth) * duration;

      if (newStartPoint <= endPointRef.current) {
        setCursor1(newStartPoint); // 커서 위치 갱신
        startPointRef.current = newStartPoint;
        // 현재 재생 위치가 새 startPoint보다 이전이라면 위치를 맞춥니다.
        if (currentTime < newStartPoint) {
          wavesurferRef.current?.setTime(newStartPoint);
        }
      }
      console.log("newStartPoint :", newStartPoint);
    }
  };

  const handleEndCursorDragStop = (e, d) => {
    if (waveformRef.current) {
      const currentTime = wavesurferRef.current?.getCurrentTime() || 0;
      // 새로운 endPoint 계산
      const newEndPoint = (d.x / waveformRef.current.clientWidth) * duration;

      if (newEndPoint >= startPointRef.current) {
        setCursor2(newEndPoint); // 커서 위치 갱신
        endPointRef.current = newEndPoint;
      }
      console.log("newEndPoint :", newEndPoint);

      // 현재 재생 위치가 새 endPoint보다 이후라면 재생을 멈추고 위치를 startPoint로 설정합니다.
      if (currentTime > newEndPoint) {
        setIsPlaying(false);
        setCurrentTime(startPointRef.current);
        wavesurferRef.current?.pause();
        wavesurferRef.current?.setTime(startPointRef.current);
      }
    }
  };

  return (
    <Card.Root
      bg="transparent"
      color="white"
      py="5px"
      px="15px"
      border="rgba(255, 255, 255, 0.3) 1.5px solid"
      borderRadius={10}
    >
      <Flex gap={3}>
        <Checkbox
          colorPalette="purple"
          onChange={() => toggleCheck(sessionId)}
        />
        <Stack width="150px" justifyContent="center">
          <Stack width="150px" justifyContent="center" alignItems="start">
            <Text fontFamily="MiceGothic" fontSize={11}>
              세션 타입 : {sessionTypeRef.current || "세션을 선택해주세요"}
            </Text>
            <Flex my={1} gap={2}>
              {sessionTypeRef.current !== type ? (
                <Button
                  width="50px"
                  height="26px"
                  fontSize="10px"
                  border="purple 2px solid"
                  borderRadius="8px"
                  onClick={handleResetSession}
                >
                  초기화
                </Button>
              ) : (
                <PopoverRoot>
                  <PopoverTrigger asChild>
                    <Button
                      width="50px"
                      height="26px"
                      fontSize="10px"
                      border="purple 2px solid"
                      borderRadius="8px"
                    >
                      변경
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                      <PopoverTitle
                        fontWeight="medium"
                        fontSize={13}
                        marginBottom={3}
                      >
                        세션 정보 변경
                      </PopoverTitle>
                      <ToggleOptions onSelectSession={handleSelectSession} />
                      <Button
                        size="sm"
                        variant="outline"
                        fontFamily="MiceGothic"
                        fontSize={11}
                        mt={4}
                        onClick={() => console.log("변경하기")}
                      >
                        변경하기
                      </Button>
                    </PopoverBody>
                  </PopoverContent>
                </PopoverRoot>
              )}
              <Button
                onClick={handleDeleteSession}
                width="50px"
                height="26px"
                fontSize="10px"
                border="purple 2px solid"
                borderRadius="8px"
              >
                삭제
              </Button>
            </Flex>
          </Stack>
        </Stack>

        <Stack width="100%" height="130px" justify="center" pt="10px">
          <Box
            ref={waveformRef}
            width="100%"
            height="100px"
            position="relative"
          >
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
              onDragStop={handleStartCursorDragStop}
              style={{ backgroundColor: "transparent", cursor: "pointer" }} // Rnd 자체 배경 제거
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
              onDragStop={handleEndCursorDragStop}
              style={{ backgroundColor: "transparent", cursor: "pointer" }} // Rnd 자체 배경 제거
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
        </Stack>

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
