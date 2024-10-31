import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Heading, Text } from "@chakra-ui/react";
import Modal from "../../components/common/Modal";

interface GameDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGame: string | null;
}

const GameDescriptionModal: React.FC<GameDescriptionModalProps> = ({
  isOpen,
  onClose,
  selectedGame,
}) => {
  const navigate = useNavigate();

  const navigateToGame = () => {
    navigate(`/game/${selectedGame}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        color="white"
        padding="40px"
        width="100%"
        maxWidth="500px"
        bg="#dcdcdc"
        borderRadius="30px"
        position="relative"
      >
        <Heading
          fontSize="48px"
          fontFamily="'OneMobile', sans-serif"
          color="#c796ff"
          textAlign="center"
          marginBottom="40px"
        >
          게임 설명
        </Heading>
        <Text
          fontSize="18px"
          fontFamily="'OneMobile'"
          marginBottom="20px"
          color="black"
          overflow="auto"
          width="100%"
        >
          {selectedGame === "drum" && (
            <>
              <span style={{ display: "block", marginTop: "3px" }}>
                리듬 킹은 실제 드럼 소리를 바탕으로,
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                주어진 리듬 예시에 맞춰 드럼을 치는 게임입니다.
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                플레이어는 다양한 난이도의 리듬 패턴을 따라 치며,
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                음악적 감각을 기르고 스트레스를 해소할 수 있다.
              </span>
            </>
          )}
          {selectedGame === "keyboards" && (
            <>
              <span style={{ display: "block", marginTop: "3px" }}>
                코드 천재는 실제 음 소리와 화음 소리를 바탕으로
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                구성된 흥미로운 게임입니다.
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                이 게임은 플레이어가 주어진 문제에 맞추어
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                정확한 음을 찾아야 하며,
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                이를 통해 음악에 대한 이해도를 높이고
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                감각을 기를 수 있도록 설계되었습니다.
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                음악적 재능을 발견하고 절대음감을 얻어보는 특별한 경험을 하게 될
                것입니다.
              </span>
            </>
          )}
          {selectedGame === "vocal" && (
            <>
              <span style={{ display: "block", marginTop: "3px" }}>
                퍼펙트 스코어는 노래에 대해 정확한 음을 발음하여
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                플레이어가 정해진 목표에 도달할 수 있도록 돕는
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                흥미로운 게임입니다.
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                이 게임은 각 음을 정확하게 찾아내는 데
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                중점을 두고 있으며,
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                자신의 음성과 음악적 감각을 발전시킬 수 있는 기회를 제공합니다.
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                다양한 레벨과 난이도를 통해 도전할 수 있으며,
              </span>
              <span style={{ display: "block", marginTop: "3px" }}>
                음악적 재능을 더욱 빛낼 수 있는 경험을 하게 될 것입니다.
              </span>
            </>
          )}
        </Text>

        <Box display="flex" justifyContent="flex-end" width="100%">
          <Button
            onClick={navigateToGame}
            borderRadius="10px"
            fontFamily="OneMobile"
          >
            게임 하러 가기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GameDescriptionModal;
