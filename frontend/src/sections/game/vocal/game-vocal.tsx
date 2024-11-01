import { useState } from "react";
import { Button, Text, Box, VStack, Heading } from "@chakra-ui/react";
import useVocal from "../../../hooks/game/vocal/useVocal";
import { NOTES } from "../../../utils/game/vocalSound";

const VocalGame = () => {
  const [level, setLevel] = useState<number>(1);
  const [targetPitch, setTargetPitch] = useState<string>("C4");
  const [status, setStatus] = useState<string>("시작하려면 발성하세요");
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  const LEVEL_TARGET_PITCHES = [
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5",
    "D5",
    "E5",
  ];

  const nextLevel = () => {
    const newLevel = level + 1;
    if (newLevel > 10) {
      setGameEnded(true);
      return;
    }
    setLevel(newLevel);
    setTargetPitch(LEVEL_TARGET_PITCHES[newLevel - 1]);
    setStatus("발성 대기 중...");
  };

  const resetGame = () => {
    setLevel(1);
    setTargetPitch(LEVEL_TARGET_PITCHES[0]);
    setStatus("시작하려면 발성하세요");
    setGameEnded(false);
  };

  const targetFrequency: number =
    440 * Math.pow(2, (NOTES.indexOf(targetPitch.slice(0, -1)) - 9) / 12);

  const { userFrequency } = useVocal(targetFrequency, () => {
    // 사용자 발성이 목표 음보다 높으면 다음 단계로 이동
    if (userFrequency && userFrequency > targetFrequency) {
      nextLevel();
    }
  });

  return (
    <VStack
      spacing={6}
      p={8}
      border="1px solid #ddd"
      borderRadius="10px"
      maxW="400px"
      mx="auto"
      mt="20px"
    >
      <Heading size="md">보컬 게임 - 레벨 {level}</Heading>
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          목표 음: {targetPitch} ({targetFrequency.toFixed(0)} Hz)
        </Text>
        <Text color="teal.500" fontSize="xl">
          {status}
        </Text>
      </Box>
      {userFrequency && (
        <Text>현재 감지된 주파수: {Math.round(userFrequency)} Hz</Text>
      )}
      {gameEnded && <Button onClick={resetGame}>게임 다시 시작하기</Button>}
    </VStack>
  );
};

export default VocalGame;
