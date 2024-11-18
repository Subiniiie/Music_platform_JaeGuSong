import axios from "axios";
import { Stack, Text, Flex, Card, Button } from "@chakra-ui/react";
import { useRef, useState } from "react";
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
import SessionMain from "./sessionMain";
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

  // startPoint, endPoint
  const [cursor1, setCursor1] = useState(initialStartPoint); // 시작 커서 위치
  const [cursor2, setCursor2] = useState(initialEndPoint); // 종료 커서 위치

  // 상태 관리 및 store 관련
  const removeSession = useWsDetailStore((state) => state.removeSession);
  const updateSession = useWsDetailStore((state) => state.updateSession);
  const setCheck = useWsDetailStore((state) => state.setCheck);
  const storeStartPoint = useWsDetailStore(
    (state) => state.sessions[sessionId]?.startPoint
  );
  const storeEndPoint = useWsDetailStore(
    (state) => state.sessions[sessionId]?.endPoint
  );
  const storeDuration = useWsDetailStore(
    (state) => state.sessions[sessionId]?.duration
  );
  const storeCheck = useWsDetailStore(
    (state) => state.sessions[sessionId]?.check
  );

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

  const handleSetCheck = (isChecked: boolean) => {
    setCheck(sessionId, isChecked);
  };

  // const handleSessionTypeChange = async () => {

  //   try {
  //     const storedToken = localStorage.getItem("jwtToken");
  //     const response = await axios.post(
  //       `${API_URL}/api/workspaces/${workspaceSeq}/session/${sessionId}`,
  //       {
  //         name: workspaceName,
  //         originSinger,
  //         originTitle,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${storedToken}`,
  //         },
  //       }
  //     );

  //     toaster.create({
  //       description: "워크스페이스가 성공적으로 생성되었습니다.",
  //       type: "success",
  //     });

  //     onWorkspaceCreated(response.data);
  //   } catch (error) {
  //     console.error("Error creating workspace:", error);
  //     toaster.create({
  //       description: "워크스페이스 생성에 실패했습니다.",
  //       type: "error",
  //     });
  //   }
  // };

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
                      <Flex justifyContent="center" alignItems="center" gap={2}>
                        <ToggleOptions onSelectSession={handleSelectSession} />
                        <Button
                          size="sm"
                          variant="outline"
                          fontFamily="MiceGothic"
                          fontSize={11}
                          onClick={() => {
                            console.log("변경하기")
                            // handleSessionTypeChange
                          }}
                        >
                          변경하기
                        </Button>
                      </Flex>
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
              
        {/* 파형 관련 세부 UI 및 로직 */}
        <SessionMain
          sessionId={sessionId}
          url={url}
          startPoint={initialStartPoint}
          endPoint={initialEndPoint}
          globalStartPoint={globalStartPoint}
          globalEndPoint={globalEndPoint}
        />

        <Stack>
          <TimePanel
            sessionId={sessionId}
            duration={storeDuration} // 세션의 총 길이 전달
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
            isPlaying={useWsDetailStore((state) => state.sessions[sessionId]?.isPlaying)}
            onPlayPause={() => {
              const store = useWsDetailStore.getState();
              const isPlaying = store.sessions[sessionId]?.isPlaying;

              if (isPlaying) {
                store.pauseSession(sessionId);
              } else {
                store.playSession(sessionId);
              }
            }}
            onStop={() => {
              const store = useWsDetailStore.getState();
              store.stopSession(sessionId); // 정지 버튼으로 세션 재생 종료 및 시작 지점으로 이동
            }}
            mode="individual"
            playWidth="200px"
            playHeight="70px"
          />
        </Stack>
      </Flex>
    </Card.Root>
  );
}
