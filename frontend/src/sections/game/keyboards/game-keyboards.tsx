import { useState } from "react";
import { Box, Text, Image, Flex } from "@chakra-ui/react";
import useNote from "@/hooks/game/keyboards/useNote";
import useChord from "@/hooks/game/keyboards/useChord";
import CustomButton from "@/components/common/Button";
import { Button } from "@chakra-ui/react";

const GamePiano = () => {
  const [mode, setMode] = useState<string | null>(null);
  const {
    note,
    selectOctave,
    options: noteOptions,
    message: noteMessage,
    playRandomNote,
    checkNoteAnswer,
    level: noteLevel,
    correctCount: noteCorrectCount,
    gameOver: noteGameOver,
    resetGame: resetNoteGame,
    handleNextLevel: handleNextNoteLevel,
    octaveSelected,
    isAnswered: isNoteAnswered,
  } = useNote();

  const {
    options: chordOptions,
    message: chordMessage,
    playRandomChord,
    checkChordAnswer,
    level: chordLevel,
    correctCount: chordCorrectCount,
    gameOver: chordGameOver,
    resetGame: resetChordGame,
    handleNextLevel: handleNextChordLevel,
    isAnswered: isChordAnswered,
  } = useChord();

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
        절대 음감
        <Image
          src="/assets/note.png"
          position="absolute"
          top="-40px"
          left="80%"
          width="100px"
          zIndex="1"
        />
      </Text>

      {mode === "note" && noteGameOver ? (
        <>
          <Text
            fontSize="30px"
            marginTop="20px"
            marginBottom="30px"
            color="skyblue"
            textAlign="center"
          >
            {noteMessage}
          </Text>
          <CustomButton onClick={resetNoteGame}>
            게임 다시 시작하기
          </CustomButton>
        </>
      ) : mode === "chord" && chordGameOver ? (
        <>
          <Text
            fontSize="30px"
            marginTop="20px"
            marginBottom="30px"
            color="skyblue"
            textAlign="center"
          >
            {chordMessage}
          </Text>
          <CustomButton onClick={resetChordGame}>
            게임 다시 시작하기
          </CustomButton>
        </>
      ) : (
        <>
          {mode === null && (
            <Flex flexDirection="row" alignItems="center" marginBottom="40px">
              <Button
                onClick={() => setMode("note")}
                width="280px"
                height="280px"
                fontSize="32px"
                margin="30px"
                bg="#1c1b3f"
                _hover={{ bg: "#4e4b7e", transform: "scale(1.2)" }}
                transition="background-color 0.3s ease, transform 0.3s ease"
                borderRadius="20px"
              >
                음정 맞추기
              </Button>
              <Button
                onClick={() => setMode("chord")}
                width="280px"
                height="280px"
                fontSize="32px"
                margin="30px"
                bg="#1c1b3f"
                _hover={{ bg: "#4e4b7e", transform: "scale(1.2)" }}
                transition="background-color 0.3s ease, transform 0.3s ease"
                borderRadius="20px"
              >
                화음 맞추기
              </Button>
            </Flex>
          )}

          {mode === "note" && (
            <Box>
              <Text
                fontSize="30px"
                marginTop="20px"
                marginBottom="30px"
                color="skyblue"
                textAlign="center"
              >
                {!octaveSelected ? "옥타브를 선택해주세요!" : ""}
              </Text>

              {!octaveSelected && (
                <Flex justifyContent="center" marginTop="20px">
                  <Button
                    onClick={() => selectOctave("1옥타브")}
                    margin="20px"
                    width="280px"
                    height="280px"
                    fontSize="32px"
                    bg="#1c1b3f"
                    _hover={{ bg: "#4e4b7e" }}
                    borderRadius="20px"
                  >
                    1옥타브
                  </Button>
                  <Button
                    onClick={() => selectOctave("2옥타브")}
                    margin="20px"
                    width="280px"
                    height="280px"
                    fontSize="32px"
                    bg="#1c1b3f"
                    _hover={{ bg: "#4e4b7e" }}
                    borderRadius="20px"
                  >
                    2옥타브
                  </Button>
                  <Button
                    onClick={() => selectOctave("3옥타브")}
                    margin="20px"
                    width="280px"
                    height="280px"
                    fontSize="32px"
                    bg="#1c1b3f"
                    _hover={{ bg: "#4e4b7e" }}
                    borderRadius="20px"
                  >
                    3옥타브
                  </Button>
                </Flex>
              )}

              {octaveSelected && (
                <>
                  <Text fontSize="32px" textAlign="center" color="white">
                    점수: {noteCorrectCount * 10} &nbsp; 단계: {noteLevel}
                  </Text>
                  <Text
                    fontSize="30px"
                    marginTop="20px"
                    marginBottom="30px"
                    color="skyblue"
                    textAlign="center"
                  >
                    {noteMessage}
                  </Text>
                  <Flex justifyContent="center" marginTop="40px">
                    {!isNoteAnswered &&
                      noteOptions.map((option) => (
                        <Button
                          key={option}
                          onClick={() => checkNoteAnswer(option)}
                          margin="20px"
                          colorScheme="blue"
                          width="200px"
                          height="200px"
                          fontSize="32px"
                          bg="#1c1b3f"
                          _hover={{ bg: "#4e4b7e" }}
                          borderRadius="20px"
                        >
                          {option}
                        </Button>
                      ))}
                  </Flex>

                  <Flex justifyContent="center" marginTop="20px">
                    {isNoteAnswered ? (
                      <CustomButton onClick={handleNextNoteLevel}>
                        다음 문제로 가기
                      </CustomButton>
                    ) : (
                      <CustomButton onClick={() => playRandomNote(note)}>
                        음 듣기
                      </CustomButton>
                    )}
                  </Flex>
                </>
              )}
            </Box>
          )}

          {mode === "chord" && (
            <Box>
              <Text fontSize="32px" textAlign="center" color="white">
                점수: {chordCorrectCount * 10} &nbsp; 단계: {chordLevel}
              </Text>

              <Text
                fontSize="30px"
                marginTop="20px"
                marginBottom="30px"
                color="skyblue"
                textAlign="center"
              >
                {chordMessage}
              </Text>

              <Flex>
                {!isChordAnswered &&
                  chordOptions.map((option) => (
                    <Button
                      key={option}
                      onClick={() => checkChordAnswer(option)}
                      margin="20px"
                      colorScheme="blue"
                      width="200px"
                      height="200px"
                      fontSize="32px"
                      bg="#1c1b3f"
                      _hover={{ bg: "#4e4b7e" }}
                      borderRadius="20px"
                    >
                      {option}
                    </Button>
                  ))}
              </Flex>

              <Flex>
                {isChordAnswered ? (
                  <CustomButton onClick={handleNextChordLevel}>
                    다음 문제로 가기
                  </CustomButton>
                ) : (
                  <CustomButton onClick={playRandomChord}>
                    화음 듣기
                  </CustomButton>
                )}
              </Flex>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default GamePiano;
