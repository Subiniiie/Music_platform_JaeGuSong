import { Flex, Stack } from "@chakra-ui/react";
import { Input, Text } from "@chakra-ui/react";
import { useState } from "react";

interface TimePanelProps {
  sessionId: string;
  duration: number;
  onStartChange: (startTime: number) => void;
  onEndChange: (endTime: number) => void;
}

export default function TimePanel({
  sessionId,
  duration,
  onStartChange,
  onEndChange,
}: TimePanelProps) {
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  //   // 시간을 MM:SS 형식으로 변환하는 함수
  //   const formatToMMSS = (timeInSeconds: number): string => {
  //     const minutes = Math.floor(timeInSeconds / 60);
  //     const seconds = timeInSeconds % 60;
  //     return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
  //       2,
  //       "0"
  //     )}`;
  //   };

  // 시간을 MM:SS 형식으로 변환하는 함수
  const formatToMMSS = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  //   // 초 단위로 변환하는 함수
  //   const parseMMSS = (value: string): number | null => {
  //     const match = value.match(/^(\d{1,2}):([0-5]?\d)$/);
  //     if (match) {
  //       const minutes = parseInt(match[1], 10);
  //       const seconds = parseInt(match[2], 10);
  //       return minutes * 60 + seconds;
  //     }
  //     return null; // 유효하지 않은 형식
  //   };

  // 초 단위로 변환하는 함수
  const parseMMSS = (value: string): number | null => {
    const match = value.match(/^(\d{1,2}):([0-5]?\d)$/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      return minutes * 60 + seconds;
    }
    return null; // 유효하지 않은 형식
  };

  const formatInput = (value: string): string => {
    // 숫자만 추출
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 2) {
      return digits; // 2자리 이하면 그대로 반환
    }

    // 뒤에서 두 번째 자리에 ":" 추가
    const minutes = digits.slice(0, -2);
    const seconds = digits.slice(-2);
    return `${minutes}:${seconds}`;
  };

  const handleInputChange = (
    value: string,
    setTime: (value: string) => void
  ) => {
    const formattedValue = formatInput(value);
    setTime(formattedValue);
  };

  const handleBlur = (
    value: string,
    setTime: (value: string) => void,
    onChange: (time: number) => void
  ) => {
    const timeInSeconds = parseMMSS(value);
    if (timeInSeconds !== null && timeInSeconds <= duration) {
      setTime(formatToMMSS(timeInSeconds)); // 유효한 입력 값만 포맷 적용
      onChange(timeInSeconds); // 부모 컴포넌트로 전달
    } else {
      setTime(formatToMMSS(0)); // 기본값으로 초기화
      onChange(0);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    setTime: (value: string) => void,
    onChange: (time: number) => void
  ) => {
    if (e.key === "Enter") {
      handleBlur(value, setTime, onChange); // Enter 키 입력 시 handleBlur 호출
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
          onBlur={() => handleBlur(startTime, setStartTime, onStartChange)} // 포커스 잃을 때 유효성 검사
          onKeyDown={(e) =>
            handleKeyDown(e, startTime, setStartTime, onStartChange)
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
          onBlur={() => handleBlur(endTime, setEndTime, onEndChange)} // 포커스 잃을 때 유효성 검사
          onKeyDown={(e) => handleKeyDown(e, endTime, setEndTime, onEndChange)} // Enter 키 입력 시 유효성 검사
          placeholder="00:00"
          width="90px"
          borderRadius="15px"
        />
      </Stack>
    </Flex>
  );
}
