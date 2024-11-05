import React, { useEffect } from "react";
import { Text, Box } from "@chakra-ui/react";
import VocalGauge from "../../../components/game/vocal-gauge";
import { NOTES } from "../../../utils/game/vocalSound";
import CustomButton from "@/components/common/Button";
import useVocalGame from "../../../hooks/game/vocal/useVocalGame";

const VocalGame: React.FC = () => {
  const {
    isListening,
    ballHeight,
    userFrequency,
    targetPitch,
    level,
    message,
    gameOver,
    startListening,
    stopListening,
    resetGame,
    isMatched,
    setTargetPitch,
    isStarted,
  } = useVocalGame();

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (level > 0) {
      const nextIndex = level;
      if (nextIndex < NOTES.length) {
        setTargetPitch(NOTES[nextIndex]);
      }
    }
  }, [level, setTargetPitch]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop="60px"
      color="white"
      padding="20px"
      fontFamily="OneMobile"
      bgGradient="linear(to-b, #4b6cb7, #182848)"
      borderRadius="20px"
      boxShadow="0px 4px 20px rgba(0, 0, 0, 0.3)"
    >
      <Text
        fontSize="72px"
        textAlign="center"
        color="#f0aaff"
        position="relative"
        textShadow="2px 2px 8px rgba(0, 0, 0, 0.3)"
      >
        도레미 게임
      </Text>

      {isStarted && (
        <>
          <Text fontSize="28px" color="white">
            {targetPitch.name}
          </Text>
          <Text fontSize="28px" color="white">
            {message}
          </Text>
        </>
      )}

      <CustomButton onClick={toggleListening}>
        {isListening ? "중지" : "시작"}
      </CustomButton>

      <VocalGauge
        frequency={userFrequency}
        targetFrequency={targetPitch.frequency}
        isMatched={isMatched}
        ballHeight={isStarted ? ballHeight : 0}
        isStarted={isStarted}
      />

      {gameOver && (
        <CustomButton onClick={resetGame}>게임 다시 시작하기</CustomButton>
      )}
    </Box>
  );
};

export default VocalGame;
