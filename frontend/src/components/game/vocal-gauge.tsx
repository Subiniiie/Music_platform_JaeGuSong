import { Box, Center } from "@chakra-ui/react";

const VocalGauge = ({
  frequency,
  targetFrequency,
  isMatched,
  ballHeight,
}: {
  frequency: number;
  targetFrequency: number;
  isMatched: boolean;
  ballHeight: number;
}) => {
  const holePosition = (targetFrequency / 493.88) * 100;

  return (
    <Box
      position="relative"
      w="80px"
      h="300px"
      bg="gray.700"
      borderRadius="full"
      overflow="hidden"
      ml={4}
    >
      <Box
        position="absolute"
        left="50%"
        transform="translateX(-50%)"
        bottom={`${ballHeight}%`}
        w="40px"
        h="40px"
        bg="blue.400"
        borderRadius="full"
        transition="bottom 0.1s ease"
      />

      <Center
        position="absolute"
        left="50%"
        transform="translate(-50%, -50%)"
        bottom={`${holePosition}%`}
        w="80px"
        h="80px"
        bg="gray.700"
        borderRadius="full"
        border="4px solid"
        borderColor={isMatched ? "green.400" : "gray.500"}
        transition="border-color 0.3s ease"
      ></Center>
    </Box>
  );
};

export default VocalGauge;
