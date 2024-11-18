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
import TimePanel from "./timePanel";

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

  // 상태 관리 및 store 관련
  const addSession = useWsDetailStore((state) => state.addSession);
  const removeSession = useWsDetailStore((state) => state.removeSession);
  const updateSession = useWsDetailStore((state) => state.updateSession);
  const setCheck = useWsDetailStore((state) => state.setCheck);
  const sessions = useWsDetailStore((state) => state.sessions);
  const storeStartPoint = useWsDetailStore(
    (state) => state.sessions[sessionId]?.startPoint
  );
  const storeEndPoint = useWsDetailStore(
    (state) => state.sessions[sessionId]?.endPoint
  );
  const storeCheck = useWsDetailStore(
    (state) => state.sessions[sessionId]?.check
  );
  const isGlobalPlaying = useWsDetailStore((state) => state.isGlobalPlaying);
  const globalDuration = useWsDetailStore((state) => state.globalDuration);

  const API_URL = import.meta.env.VITE_API_URL;

  // startPoint, endPoint - 재렌더링 방지
  const startPointRef = useRef(
    storeStartPoint !== 0 ? storeStartPoint : initialStartPoint
  );
  const endPointRef = useRef(
    storeEndPoint !== 0 ? storeEndPoint : initialEndPoint
  );

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

  const waveformWidth = (globalDuration !== 0) && (duration !== 0) ? (duration / globalDuration) * 100 : 100

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
      console.log("after addSession", useWsDetailStore.getState().sessions);
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

    return () => {
      wavesurferRef.current?.destroy();
      waveformRef.current?.removeEventListener(
        "click",
        updateCurrentTimeOnClick
      );
    };
  }, [sessionId, addSession, removeSession, url]);

  const handlePlayPause = () => {
    console.log("넌 플레이 버튼을 눌렀지.");
    console.log("isPlaying :", isPlaying);

    if (!wavesurferRef.current) return; // WaveSurfer 인스턴스가 없는 경우 처리

    if (isPlaying) {
      wavesurferRef.current?.pause();
    } else {
      // 종료 지점을 넘지 않았는지 확인하기 위해 audioprocess 이벤트 등록
      if (!isGlobalPlaying) {
        console.log(
          "여기는 session. handlePlayPause. isGlobalPlaying :",
          isGlobalPlaying
        );
        wavesurferRef.current.on("audioprocess", () => {
          const currentTime = wavesurferRef.current?.getCurrentTime() || 0;

          if (currentTime > endPointRef.current) {
            console.log("종료 지점에 도달, 재생 정지");
            wavesurferRef.current?.pause(); // 정지
            wavesurferRef.current?.setTime(startPointRef.current); // 시작 지점으로 되돌리기
            setCurrentTime(startPointRef.current); // 상태 업데이트
            setIsPlaying(false); // 재생 상태 업데이트
          }
        });

        // 재생 시작
        if (wavesurferRef.current.getCurrentTime() < startPointRef.current) {
          wavesurferRef.current.setTime(startPointRef.current); // 시작 지점 설정
        }
        wavesurferRef.current.play();
      }
    }

    setIsPlaying(!isPlaying);
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

      removeSession(sessionId);
      console.log("store 의 sessions :", useWsDetailStore.getState().sessions);

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

        updateSession(sessionId, { startPoint: newStartPoint });
      }
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
        updateSession(sessionId, { endPoint: newEndPoint });
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

  const handleSetCheck = (isChecked: boolean) => {
    setCheck(sessionId, isChecked);
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
      <Flex gap={3} alignItems="center">
        <Checkbox
          colorPalette="purple"
          checked={storeCheck} // store에서 현재 세션의 체크 상태를 가져옴
          onChange={(e) => handleSetCheck(e.target.checked)}
          cursor="pointer"
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

        <Stack
          // width="100%"
          flex={1}
          height="150px" justify="center" pt="10px" mr="12px">
          <Box
            ref={waveformRef}
            width={`${waveformWidth}%`}
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
              enableResizing={false} // 크기 조정 비활성화
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
                    top: -6, // 바의 위쪽에 삼각형이 위치하도록
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
              enableResizing={false} // 크기 조정 비활성화
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
                    top: -6, // 바의 위쪽에 삼각형이 위치하도록
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

            {/* notDraggable globalStartPoint 커서 */}
            <Rnd
              bounds="parent"
              size={{ width: 2, height: 100 }}
              position={{
                x:
                  waveformRef.current && duration > 0
                    ? (globalStartPoint / duration) *
                      waveformRef.current.clientWidth
                    : 0,
                y: 0,
              }}
              enableDragging={false} // 드래그 비활성화
              enableResizing={false} // 크기 조정 비활성화
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
                    top: 94, // 바의 위쪽에 삼각형이 위치하도록
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderBottom: "10px solid grey", // 삼각형 색상
                  }}
                ></div>

                {/* 바 부분 */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "grey",
                  }}
                ></div>
              </div>
            </Rnd>

            {/* notDraggable globalEndPoint 커서 */}
            <Rnd
              bounds="parent"
              size={{ width: 2, height: 100 }}
              position={{
                x:
                  waveformRef.current && duration > 0
                    ? (globalEndPoint / duration) *
                      waveformRef.current.clientWidth
                    : 0,
                y: 0,
              }}
              enableDragging={false} // 드래그 비활성화
              enableResizing={false} // 크기 조정 비활성화
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
                    top: 94, // 바의 위쪽에 삼각형이 위치하도록
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderBottom: "10px solid grey", // 삼각형 색상
                  }}
                ></div>

                {/* 바 부분 */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "grey",
                  }}
                ></div>
              </div>
            </Rnd>
          </Box>

          <Flex justifyContent="space-between" width={`${waveformWidth}%`}>
            <Text fontSize={10}>{formatTime(currentTime)}</Text>
            <Text fontSize={10}>{formatTime(duration)}</Text>
          </Flex>
        </Stack>

        <Stack>
          <TimePanel
            sessionId={sessionId}
            duration={duration} // 세션의 총 길이 전달
            onStartChange={(startTime) => {
              setCursor1(startTime); // 커서 이동
              startPointRef.current = startTime;
              updateSession(sessionId, { startPoint: startTime }); // store 업데이트
            }}
            onEndChange={(endTime) => {
              setCursor2(endTime); // 커서 이동
              endPointRef.current = endTime;
              updateSession(sessionId, { endPoint: endTime }); // store 업데이트
            }}
          />
          <Play
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onStop={handleStop}
            mode="individual"
            playWidth="200px"
            playHeight="70px"
          />
        </Stack>
      </Flex>
    </Card.Root>
  );
}
