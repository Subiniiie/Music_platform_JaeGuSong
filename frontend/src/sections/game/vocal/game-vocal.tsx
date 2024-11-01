import { useState, useEffect } from "react";
import useVocalGame from "@/hooks/game/vocal/useVocal";
import { Box, Text, Flex } from "@chakra-ui/react";
import CustomButton from "@/components/common/Button";

const GameVocalGame = () => {
  const [targetNote, setTargetNote] = useState<string>("");
  const [level, setLevel] = useState<number>(1); // 게임 단계
  const maxLevel = 10; // 최대 단계
  const { message, currentNote, isGameActive, startGame } =
    useVocalGame(targetNote);

  // 랜덤 목표 음 생성 함수
  const generateRandomNote = () => {
    const notes = [
      "C4",
      "C#4",
      "D4",
      "D#4",
      "E4",
      "F4",
      "F#4",
      "G4",
      "G#4",
      "A4",
      "A#4",
      "B4",
      "C5",
      "C#5",
      "D5",
      "D#5",
      "E5",
      "F5",
      "F#5",
      "G5",
      "G#5",
      "A5",
      "A#5",
      "B5",
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  };

  useEffect(() => {
    if (isGameActive && level <= maxLevel) {
      setTargetNote(generateRandomNote());
    }
  }, [isGameActive, level]);

  const handleMessageUpdate = () => {
    if (currentNote) {
      if (currentNote === targetNote) {
        setLevel((prevLevel) => prevLevel + 1); // 다음 단계로 진행
        if (level < maxLevel) {
          setTargetNote(generateRandomNote()); // 다음 목표 음 생성
        } else {
          setLevel(1); // 게임이 끝나면 단계 초기화
        }
      } else {
        if (currentNote < targetNote) {
          setMessage("더 높게!");
        } else {
          setMessage("더 낮게!");
        }
      }
    }
  };

  useEffect(() => {
    handleMessageUpdate();
  }, [currentNote]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      backgroundColor="#02001f"
      color="white"
      fontFamily="OneMobile"
      marginTop="60px"
    >
      <Text
        fontSize="64px"
        textAlign="center"
        color="#c796ff"
        marginBottom="50px"
      >
        퍼펙트 싱어
      </Text>

      <Text marginY="20px" fontSize="24px">
        미션: {targetNote} 음 맞추기
      </Text>

      <Text fontSize="28px" marginY="20px">
        {currentNote ? `현재 음정: ${currentNote}` : "음성을 감지 중..."}
      </Text>

      <Flex
        justifyContent="center"
        marginTop="0"
        position="fixed"
        bottom="20px"
        right="20px"
      >
        <CustomButton onClick={startGame}>
          {isGameActive ? "게임 끝" : "게임 시작"}
        </CustomButton>
      </Flex>

      <Text
        fontSize="20px"
        marginTop="20px"
        className={message === "Perfect!" ? "perfect" : ""}
        color={message === "Perfect!" ? "#1e90ff" : "white"}
      >
        {currentNote && message}
      </Text>

      {level > maxLevel && (
        <Text fontSize="20px" marginTop="20px" color="gold">
          게임 완료! 축하합니다!
        </Text>
      )}
    </Box>
  );
};

export default GameVocalGame;
