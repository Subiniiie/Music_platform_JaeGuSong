import { Box, Stack, Text, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import WaveSurfer from "wavesurfer.js";
import { useWsDetailStore } from "@/stores/wsDetailStore";

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

  const handleStartCursorDragStop = (e, d) => {
    console.log("안녕 난 handleStartCursorDragStop");
  
    if (!waveformRef.current || !wavesurferRef.current) {
      console.error("Waveform 또는 WaveSurfer가 초기화되지 않았습니다.");
      return;
    }
  
    const newStartPoint = (d.x / waveformRef.current.clientWidth) * duration; // 드래그 위치를 계산
    console.log("newStartPoint 계산 완료:", newStartPoint);
  
    // 예외 처리: 새로운 시작 지점이 종료 지점을 넘는 경우 무시
    if (newStartPoint >= storeEndPoint) {
      console.warn("새로운 시작 지점이 종료 지점을 넘을 수 없습니다.");
      return;
    }
  
    // WaveSurfer와 UI의 시작 지점 동기화
    startPointRef.current = newStartPoint;
    updateStartPoint(sessionId, newStartPoint); // Store 업데이트
    console.log("Store에 startPoint 업데이트 완료!");
  
    // 현재 재생 위치가 새로운 시작 지점보다 이전이라면 위치 동기화
    const currentTime = wavesurferRef.current.getCurrentTime() || 0;
    if (currentTime < newStartPoint) {
      wavesurferRef.current.setTime(newStartPoint); // WaveSurfer의 재생 위치를 새 시작 지점으로 이동
      console.log("WaveSurfer의 재생 위치를 새로운 시작 지점으로 이동 완료!");
    }
  
    // UI 커서 위치 갱신
    setCursor1(newStartPoint);
    console.log("UI 커서 위치 갱신 완료!");
  };
  
  
  const handleEndCursorDragStop = (e, d) => {
    if (!waveformRef.current || !wavesurferRef.current) {
      console.error("Waveform 또는 WaveSurfer가 초기화되지 않았습니다.");
      return;
    }

    const newEndPoint = (d.x / waveformRef.current.clientWidth) * duration; // 드래그 위치를 계산

    if (newEndPoint < storeStartPoint) {
      console.warn("새로운 종료 지점이 시작 지점을 넘을 수 없습니다.");
      return;
    }

    // WaveSurfer와 UI의 종료 지점 동기화
    endPointRef.current = newEndPoint;
    updateEndPoint(sessionId, newEndPoint); // Store 업데이트
  
    // 현재 재생 위치가 새로운 종료 지점보다 이후라면 위치 재설정
    const currentTime = wavesurferRef.current.getCurrentTime() || 0;
    if (currentTime > newEndPoint) {
      wavesurferRef.current.setTime(newEndPoint); // WaveSurfer의 재생 위치를 새 시작 지점으로 이동
      console.log("WaveSurfer의 재생 위치를 새로운 종료 지점으로 이동 완료!");
    }
  
    // UI 커서 위치 갱신
    setCursor2(newEndPoint);
    console.log("UI 커서 위치 갱신 완료!");
  };

  useEffect(() => {
    if (storeStartPoint !== undefined) {
      setCursor1(storeStartPoint); // Store 값 변경 시 cursor1 업데이트
      // currentTime 유효성 검사 및 업데이트
      if (wavesurferRef.current) {
        const currentTime = wavesurferRef.current.getCurrentTime() || 0;
  
        if (currentTime < storeStartPoint) {
          wavesurferRef.current.setTime(storeStartPoint);
          setCurrentTime(storeStartPoint); // currentTime을 startPoint로 업데이트
          console.log("currentTime이 startPoint보다 작아 업데이트되었습니다.");
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
          console.log("currentTime이 endPoint보다 커 업데이트되었습니다.");
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

          <Flex justifyContent="space-between" width="100%">
            <Text fontSize={10}>{formatTime(currentTime)}</Text>
            <Text fontSize={10}>{formatTime(duration)}</Text>
          </Flex>
        </Stack>
      </Stack>

      {waveformWidth < 100 && (
        <Stack width={`(${100 - waveformWidth})%`}>
          <Text fontSize={12}>이 공간을 활용해서 드래그 가능하게</Text>
          <Text>{`(${100 - waveformWidth})%`}</Text>
        </Stack>
      )}
    </Flex>
  )
}
