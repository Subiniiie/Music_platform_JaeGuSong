import { useState } from "react";
import { FaDrum, FaMicrophone } from "react-icons/fa";
import { GiPianoKeys } from "react-icons/gi";
import { Box, Text, Flex, Button, Icon } from "@chakra-ui/react";
import GameDescriptionModal from "../../../components/game/game-description";

type GameType = "piano" | "drum" | "melody" | null;

const Game: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  const openModal = (game: GameType) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt="100px"
      height="100vh"
      bg="#02001f"
      color="white"
    >
      <Text
        fontSize="64px"
        fontFamily="OneMobile, sans-serif"
        color="#c796ff"
        textAlign="center"
        mb="100px"
      >
        미니 게임
      </Text>
      <Flex
        justifyContent="space-around"
        width="90%"
        maxWidth="1000px"
        mb="40px"
        wrap="wrap"
      >
        <Button
          onClick={() => openModal("piano")}
          display="flex"
          flexDirection="column"
          alignItems="center"
          bg="#1c1b3f"
          color="white"
          p="20px"
          borderRadius="10px"
          width="280px"
          height="280px"
          justifyContent="center"
          transition="background-color 0.3s ease, transform 0.3s ease"
          _hover={{ bg: "#4e4b7e", transform: "scale(1.2)" }}
          fontFamily="OneMobile"
        >
          <Icon as={GiPianoKeys} boxSize="80px" mb="10px" />
          <Text fontSize="24px" fontWeight="bold">
            절대 음감
          </Text>
        </Button>
        <Button
          onClick={() => openModal("drum")}
          display="flex"
          flexDirection="column"
          alignItems="center"
          bg="#1c1b3f"
          color="white"
          p="20px"
          borderRadius="10px"
          width="280px"
          height="280px"
          justifyContent="center"
          transition="background-color 0.3s ease, transform 0.3s ease"
          _hover={{ bg: "#4e4b7e", transform: "scale(1.2)" }}
          fontFamily="OneMobile"
        >
          <Icon as={FaDrum} boxSize="80px" mb="10px" />
          <Text fontSize="24px" fontWeight="bold">
            리듬 킹
          </Text>
        </Button>
        <Button
          onClick={() => openModal("melody")}
          display="flex"
          flexDirection="column"
          alignItems="center"
          bg="#1c1b3f"
          color="white"
          p="20px"
          borderRadius="10px"
          width="280px"
          height="280px"
          justifyContent="center"
          transition="background-color 0.3s ease, transform 0.3s ease"
          _hover={{ bg: "#4e4b7e", transform: "scale(1.2)" }}
          fontFamily="OneMobile"
        >
          <Icon as={FaMicrophone} boxSize="80px" mb="10px" />
          <Text fontSize="24px" fontWeight="bold">
            퍼펙트 싱어
          </Text>
        </Button>
      </Flex>
      <GameDescriptionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedGame={selectedGame}
      />
    </Box>
  );
};

export default Game;
