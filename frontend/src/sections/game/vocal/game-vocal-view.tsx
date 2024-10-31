import { useState } from "react";
import useVocalGame from "@/hooks/game/vocal/useVocal";
import { Box, Text, Flex } from "@chakra-ui/react";
import CustomButton from "@/components/common/Button";
const GameVocalGame = () => {
  const [targetNote, setTargetNote] = useState("C4");
  const { message, currentNote, isGameActive, startGame } =
    useVocalGame(targetNote);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="100vh"
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
    </Box>
  );
};

export default GameVocalGame;
