import React, { useEffect, useState } from "react";
import { Text, Box } from "@chakra-ui/react";
import VocalGauge from "../../../components/game/vocal-gauge";
import useVocal from "../../../hooks/game/vocal/useVocal";
import { NOTES } from "../../../utils/game/vocalSound";
import CustomButton from "@/components/common/Button";
import { useVocalGame } from "../../../hooks/game/vocal/useVocalGame";

const VocalGame: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [targetPitch, setTargetPitch] = useState<number>(NOTES[0]);
  console.log(targetPitch);
  const { level, message, gameOver, handleNextLevel, resetGame } =
    useVocalGame(isListening);

  const {
    ballHeight,
    isMatched,
    userFrequency,
    startListening,
    stopListening,
  } = useVocal(targetPitch);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
    setIsListening(!isListening);
  };

  useEffect(() => {
    if (isMatched) {
      handleNextLevel(); // 주파수가 일치하면 다음 단계로 넘어가기
    }
  }, [isMatched, handleNextLevel]); // isMatched와 handleNextLevel을 의존성 배열에 추가

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop="60px"
      color="white"
      padding="20px"
      fontFamily="OneMobile"
    >
      <Text
        fontSize="64px"
        textAlign="center"
        color="#c796ff"
        position="relative"
        marginBottom="50px"
      >
        도레미 게임
      </Text>
      <Text>현재 단계: {level}</Text>
      <Text>{message}</Text>
      <CustomButton onClick={toggleListening}>
        {isListening ? "중지" : "시작"}
      </CustomButton>
      <VocalGauge
        frequency={userFrequency}
        targetFrequency={targetPitch}
        isMatched={isMatched}
        ballHeight={ballHeight}
      />
      {gameOver && (
        <CustomButton colorScheme="red" onClick={resetGame}>
          게임 다시 시작하기
        </CustomButton>
      )}
    </Box>
  );
};

export default VocalGame;
