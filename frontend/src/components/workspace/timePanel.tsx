import { Flex, Stack } from "@chakra-ui/react";
import { Input, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useWsDetailStore } from "@/stores/wsDetailStore";

interface TimePanelProps {
  sessionId: string;
  duration: number;
}

export default function TimePanel({
  sessionId,
  duration,
}: TimePanelProps) {
  const startPoint = useWsDetailStore((state) => state.sessions[sessionId]?.startPoint || 0);
  const endPoint = useWsDetailStore((state) => state.sessions[sessionId]?.endPoint || duration);
  const updateStartPoint = useWsDetailStore((state) => state.updateStartPoint);
  const updateEndPoint = useWsDetailStore((state) => state.updateEndPoint);

  // 시간을 MM:SS 형식으로 변환하는 함수
  const formatToMMSS = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const [startTime, setStartTime] = useState(formatToMMSS(startPoint));
  const [endTime, setEndTime] = useState(formatToMMSS(endPoint));

  const parseMMSS = (value: string): number | null => {
    const match = value.match(/^(\d{1,2}):([0-5]?\d)$/);
  
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      return minutes * 60 + seconds;
    } else {
      console.warn("유효하지 않은 형식입니다:", value);
      return null;
    }
  };

  const formatInput = (value: string): string => {
    console.log("formatInput 입력값:", value);
    const digits = value.replace(/\D/g, "");
    console.log("추출된 숫자:", digits);
  
    if (digits.length <= 2) {
      console.log("최종 포맷:", digits);
      return digits;
    }
  
    const minutes = digits.slice(0, -2);
    const seconds = digits.slice(-2);
    console.log("분:", minutes, "초:", seconds);
    return `${minutes}:${seconds}`;
  };
  

  const handleInputChange = (
    value: string,
    setTime: (value: string) => void
  ) => {
    const formattedValue = formatInput(value);
    setTime(formattedValue);
  };

  useEffect(() => {
    setStartTime(formatToMMSS(startPoint));
  }, [startPoint]);

  useEffect(() => {
    setEndTime(formatToMMSS(endPoint));
  }, [endPoint]);

  // 시간 입력이 완료되었을 때
  // const handleBlur = (
  //   value: string,
  //   setTime: (value: string) => void,
  //   onChange: (time: number) => void
  // ) => {
  
  //   const timeInSeconds = parseMMSS(value);
  
  //   if (timeInSeconds !== null && timeInSeconds <= duration) {
  //     setTime(formatToMMSS(timeInSeconds));
  //     onChange(timeInSeconds); // 부모에게 전달
  //   } else {
  //     console.warn("유효하지 않은 값. 기본값으로 초기화.");
  //     setTime(formatToMMSS(0));
  //     onChange(0); // 기본값 전달
  //   }
  // };

  const handleBlur = (value: string, setTime: (value: string) => void, updatePoint: (id: string, point: number) => void) => {
    const timeInSeconds = parseMMSS(value);

    if (timeInSeconds !== null && timeInSeconds <= duration) {
      setTime(formatToMMSS(timeInSeconds));
      updatePoint(sessionId, timeInSeconds); // store 업데이트
    } else {
      setTime(formatToMMSS(0));
      updatePoint(sessionId, 0); // 기본값
    }
  };
  

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    setTime: (value: string) => void,
    updatePoint: (id: string, point: number) => void,
  ) => {
    if (e.key === "Enter") {
      handleBlur(value, setTime, updatePoint); // Enter 키 입력 시 handleBlur 호출
    }
  };

  return (
    <Flex
      gap="6px"
      bg="gray.800"
      p="7px"
      borderRadius="15px"
      border="0.5px solid rgba(255, 255, 255, 0.2)"
      justifyContent="center"
      alignItems="center"
      background="rgba(0, 0, 0, 0.3)"
      width="200px"
      height="80px"
    >
      <Stack height="60px" justifyContent="center">
        <Text fontSize="12px">시작 지점</Text>
        <Input
          value={startTime}
          //   onChange={(e) => setStartTime(e.target.value)} // 입력 중에는 자유롭게 값 업데이트
          onChange={(e) => handleInputChange(e.target.value, setStartTime)} // 입력 시 자동 포맷 적용
          onBlur={() => handleBlur(startTime, setStartTime, updateStartPoint)} // 포커스 잃을 때 유효성 검사
          onKeyDown={(e) =>
            handleKeyDown(e, startTime, setStartTime, updateStartPoint)
          } // Enter 키 입력 시 유효성 검사
          placeholder="00:00"
          width="90px"
          borderRadius="15px"
        />
      </Stack>
      <Stack height="60px" justifyContent="center">
        <Text fontSize="12px">종료 지점</Text>
        <Input
          value={endTime}
          //   onChange={(e) => setEndTime(e.target.value)} // 입력 중에는 자유롭게 값 업데이트
          onChange={(e) => handleInputChange(e.target.value, setEndTime)} // 입력 시 자동 포맷 적용
          onBlur={() => handleBlur(endTime, setEndTime, updateEndPoint)} // 포커스 잃을 때 유효성 검사
          onKeyDown={(e) => handleKeyDown(e, endTime, setEndTime, updateEndPoint)} // Enter 키 입력 시 유효성 검사
          placeholder="00:00"
          width="90px"
          borderRadius="15px"
        />
      </Stack>
    </Flex>
  );
}
