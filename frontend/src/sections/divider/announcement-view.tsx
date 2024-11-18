import paths from "@/configs/paths";
import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function DividerAnnouncementView() {
  const navigate = useNavigate();

  const handleCommunity = () => {
    navigate(paths.community.main);
  };

  const handleGame = () => {
    navigate(paths.game.home);
  };

  return (
    <Stack alignItems="center" justifyContent="center" height="100%">
      <Stack gap="2" marginBottom="10" alignItems="center">
        <Text fontFamily="MiceGothic" fontSize={15} color="white">
          파일 업로드가 성공적으로 완료 되었습니다.
        </Text>
        <Text fontFamily="MiceGothic" fontSize={15} color="white">
          세션 추출이 완료되는동안 다른 서비스를 이용하시겠습니까?
        </Text>
      </Stack>

      <Flex gap="10">
        <Button fontFamily="MiceGothic" fontSize={13} onClick={handleCommunity}>
          커뮤니티 구경 가기
        </Button>
        <Button fontFamily="MiceGothic" fontSize={13} onClick={handleGame}>
          게임하러 가기
        </Button>
      </Flex>
    </Stack>
  );
}
