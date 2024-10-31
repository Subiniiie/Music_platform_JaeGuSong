import { useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import GameDescriptionModal from "../../../components/game/game-description";
import Chat from "@/sections/chat/chat";

type GameType = "keyboards" | "drum" | "vocal" | null;

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
          onClick={() => openModal("keyboards")}
          display="flex"
          flexDirection="column"
          alignItems="center"
          bg="#1c1b3f"
          color="white"
          p="20px"
          borderRadius="20px"
          width="280px"
          height="280px"
          justifyContent="center"
          transition="background-color 0.3s ease, transform 0.3s ease"
          _hover={{ bg: "#4e4b7e", transform: "scale(1.2)" }}
          fontFamily="OneMobile"
        >
          <img
            src="/assets/keyboards.png"
            style={{ width: "80px", marginBottom: "10px" }}
          />
          <Text fontSize="32px" paddingTop="20px">
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
          borderRadius="20px"
          width="280px"
          height="280px"
          justifyContent="center"
          transition="background-color 0.3s ease, transform 0.3s ease"
          _hover={{ bg: "#4e4b7e", transform: "scale(1.2)" }}
          fontFamily="OneMobile"
        >
          <img
            src="/assets/drum.png"
            style={{ width: "80px", marginBottom: "10px" }}
          />
          <Text fontSize="32px" paddingTop="20px">
            리듬 킹
          </Text>
        </Button>
        <Button
          onClick={() => openModal("vocal")}
          display="flex"
          flexDirection="column"
          alignItems="center"
          bg="#1c1b3f"
          color="white"
          p="20px"
          borderRadius="20px"
          width="280px"
          height="280px"
          justifyContent="center"
          transition="background-color 0.3s ease, transform 0.3s ease"
          _hover={{ bg: "#4e4b7e", transform: "scale(1.2)" }}
          fontFamily="OneMobile"
        >
          <img
            src="/assets/vocal.png"
            style={{ width: "80px", marginBottom: "10px" }}
          />
          <Text fontSize="32px" paddingTop="20px">
            퍼펙트 싱어
          </Text>
        </Button>
      </Flex>
      <Chat />
      <GameDescriptionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedGame={selectedGame}
      />
    </Box>
  );
};

export default Game;
