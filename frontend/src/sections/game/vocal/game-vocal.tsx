import { Text, Box } from "@chakra-ui/react";
import { useVocalGame } from "../../../hooks/game/vocal/useVocalGame";
import useVocal from "../../../hooks/game/vocal/useVocal";
import CustomButton from "@/components/common/Button";

const VocalGame = () => {
  const {
    level,
    targetPitch,
    message,
    gameOver,
    isMicActive,
    targetFrequency,
    nextLevel,
    resetGame,
    handleMicToggle,
  } = useVocalGame();

  const { userFrequency } = useVocal(
    isMicActive ? targetFrequency : null,
    isMicActive,
    nextLevel
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop="60px"
      padding="20px"
      fontFamily="OneMobile"
      color="white"
    >
      <Text
        fontSize="72px"
        fontWeight="bold"
        color="#c796ff"
        marginBottom="50px"
        position="relative"
      >
        퍼펙트 싱어
      </Text>

      <Box>
        <Text color="white" fontSize="32px" textAlign="center">
          단계: {level}
        </Text>

        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="#ffcc99">
            목표 음: {targetPitch} ({targetFrequency.toFixed(0)} Hz)
          </Text>
          <Text color="teal.300" fontSize="lg" mt={2}>
            {message}
          </Text>
        </Box>

        {userFrequency && isMicActive && (
          <Text fontSize="xl" color="yellow.300">
            현재 감지된 주파수: {Math.round(userFrequency)} Hz
          </Text>
        )}

        <CustomButton onClick={isMicActive ? resetGame : handleMicToggle}>
          {isMicActive
            ? "마이크 끄기"
            : gameOver
            ? "게임 다시 시작하기"
            : "마이크 켜기"}
        </CustomButton>

        {!gameOver && !isMicActive && (
          <Text fontSize="sm" color="gray.400">
            마이크를 켜고 목표 음을 달성하면 자동으로 다음 레벨로 이동합니다.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default VocalGame;
