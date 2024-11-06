import React from "react";
import { Text, Box } from "@chakra-ui/react";
import CustomButton from "@/components/common/Button";
import useVocalGame from "../../../hooks/game/vocal/useVocalGame";

const VocalGame: React.FC = () => {
  const {
    isListening,
    userFrequency,
    gameOver,
    obstacles,
    timeRemaining,
    lives,
    toggleListening,
  } = useVocalGame();

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
      position="relative"
      height="600px"
      overflow="hidden"
    >
      {!isListening && (
        <Text fontSize="72px" textAlign="center" color="#f0aaff">
          음표 피하기 게임
        </Text>
      )}

      <Text fontSize="28px" color="white">
        남은 시간: {timeRemaining}초
      </Text>

      <Box
        position="absolute"
        bottom="50px"
        left={`${userFrequency}px`}
        width="30px"
        height="30px"
        backgroundColor="blue.400"
        borderRadius="full"
        transition="left 0.1s ease"
      />

      {obstacles.map((obstacle, index) => (
        <Box
          key={index}
          position="absolute"
          bottom={`${obstacle.height}px`}
          left={`${obstacle.position}px`}
          width="50px"
          height="50px"
          backgroundImage="url('/assets/note2.png')"
          backgroundSize="cover"
          backgroundPosition="center"
        />
      ))}

      <CustomButton onClick={toggleListening}>
        {gameOver ? "게임 다시 시작하기" : isListening ? "중지" : "시작"}
      </CustomButton>

      {gameOver && (
        <Text fontSize="28px" color={lives <= 0 ? "red" : "skyblue"}>
          {lives <= 0 ? "게임 오버! " : "게임 클리어 !"}
        </Text>
      )}
    </Box>
  );
};

export default VocalGame;
