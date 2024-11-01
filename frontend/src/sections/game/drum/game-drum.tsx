import { Box, Text, Flex } from "@chakra-ui/react";
import useDrumGame from "@/hooks/game/drum/useDrumGame";
import sounds from "@/utils/game/drumSound";
import CustomButton from "@/components/common/Button";

const GameDrum = () => {
  const {
    score,
    pattern,
    isPlayingPattern,
    message,
    level,
    gameOver,
    isGameStarted,
    currentBeat,
    handleDrumClick,
    startPatternGame,
    resetGame,
    playPattern,
  } = useDrumGame();

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
        marginBottom="50px"
        color="#c796ff"
      >
        리듬 킹
      </Text>
      {isGameStarted && (
        <>
          <Flex
            justifyContent="center"
            alignItems="center"
            marginBottom="20px"
            fontSize="32px"
            color="white"
          >
            점수 : {score} &nbsp; 단계: {level}
          </Flex>
          <Text
            marginTop="20px"
            marginBottom="20px"
            fontSize="30px"
            color="skyblue"
          >
            {message}
          </Text>
        </>
      )}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginBottom="20px"
      >
        <Flex justifyContent="center" margin="10px 0">
          {Object.keys(sounds)
            .slice(0, 5)
            .map((beat) => (
              <Box
                key={beat}
                onClick={() => handleDrumClick(beat)}
                width="120px"
                height="120px"
                borderRadius="50%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="20px"
                fontWeight="bold"
                cursor="pointer"
                background="radial-gradient(circle at center, #444, #888)"
                boxShadow="inset 0 0 10px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.8)"
                margin="10px"
                position="relative"
                transition="transform 0.3s, background 0.3s, box-shadow 0.3s"
                border="4px solid #222"
                _after={{
                  content: '""',
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  right: "8px",
                  bottom: "8px",
                  borderRadius: "50%",
                  border: "4px solid #fff",
                  boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.3)",
                }}
                _hover={{
                  transform: "scale(1.1)",
                  boxShadow:
                    "inset 0 0 15px rgba(0, 0, 0, 0.5), 0 12px 20px rgba(0, 0, 0, 0.9)",
                }}
                _active={{
                  background: "radial-gradient(circle at center, #666, #999)",
                  boxShadow:
                    "inset 0 0 15px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 255, 255, 1)",
                  transform: "scale(1.1)",
                  border: "4px solid #fff",
                }}
                opacity={isPlayingPattern ? 0.5 : 1}
                pointerEvents={isPlayingPattern ? "none" : "auto"}
                borderColor={currentBeat === beat ? "#fff" : "#222"}
                transform={currentBeat === beat ? "scale(1.1)" : "scale(1)"}
              >
                {beat}
              </Box>
            ))}
        </Flex>
        <Flex justifyContent="center" margin="10px 0">
          {Object.keys(sounds)
            .slice(5, 9)
            .map((beat) => (
              <Box
                key={beat}
                onClick={() => handleDrumClick(beat)}
                width="120px"
                height="120px"
                borderRadius="50%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="20px"
                fontWeight="bold"
                cursor="pointer"
                background="radial-gradient(circle at center, #444, #888)"
                boxShadow="inset 0 0 10px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.8)"
                margin="0 10px 0 10px"
                position="relative"
                transition="transform 0.1s, background 0.3s, box-shadow 0.3s"
                border="4px solid #222"
                _after={{
                  content: '""',
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  right: "8px",
                  bottom: "8px",
                  borderRadius: "50%",
                  border: "4px solid #fff",
                  boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.3)",
                }}
                _hover={{
                  transform: "scale(1.1)",
                  boxShadow:
                    "inset 0 0 15px rgba(0, 0, 0, 0.5), 0 12px 20px rgba(0, 0, 0, 0.9)",
                }}
                _active={{
                  background: "radial-gradient(circle at center, #666, #999)",
                  boxShadow:
                    "inset 0 0 15px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 255, 255, 1)",
                  transform: "scale(1.1)",
                  border: "4px solid #fff",
                }}
                opacity={isPlayingPattern ? 0.5 : 1}
                pointerEvents={isPlayingPattern ? "none" : "auto"}
                borderColor={currentBeat === beat ? "#fff" : "#222"}
                transform={currentBeat === beat ? "scale(1.1)" : "scale(1)"}
              >
                {beat}
              </Box>
            ))}
        </Flex>
      </Box>
      <Box position="relative">
        <Box position="absolute">
          {isGameStarted ? (
            <>
              <CustomButton
                onClick={resetGame}
                style={{ marginRight: "140px" }}
              >
                다시 하기
              </CustomButton>
              <CustomButton
                onClick={() => playPattern(pattern, level)}
                disabled={isPlayingPattern || gameOver || pattern.length === 0}
              >
                다시 듣기
              </CustomButton>
            </>
          ) : (
            <CustomButton
              onClick={startPatternGame}
              disabled={isPlayingPattern && !gameOver}
            >
              시작
            </CustomButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GameDrum;
