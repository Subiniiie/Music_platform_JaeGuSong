import { Button } from "@chakra-ui/react";

export default function WsButton({ children }) {
  return (
    <Button
      bg="blackAlpha.900" // 검은 배경
      color="white" // 텍스트 색상
      border="2px solid" // 테두리 두께
      borderColor="purple.500" // 보라색 테두리
      borderRadius="md" // 모서리 둥글게
      _hover={{ bg: "purple.700" }} // 호버 효과
      _active={{ bg: "purple.800" }} // 클릭 효과
      paddingX="4"
      paddingY="2"
    >
      {children}
    </Button>
  );
}
