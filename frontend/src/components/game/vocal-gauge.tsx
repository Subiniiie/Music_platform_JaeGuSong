import { Box, Center } from "@chakra-ui/react";

const VocalGauge = ({
  frequency,
  targetFrequency,
  isMatched,
  ballHeight,
  isStarted,
}) => {
  const holePosition = (targetFrequency / 493.88) * 100; // 최대 주파수에 대한 위치 계산

  return (
    <Box
      position="relative"
      w="400px"
      h="300px"
      bg="white"
      border="4px solid #4b6cb7"
      borderRadius="15px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      ml={4}
      mt={6}
      overflow="hidden"
      boxShadow="10px 10px 25px rgba(0, 0, 0, 0.2)"
    >
      {isStarted && (
        <Box
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          bottom={`${ballHeight}%`}
          w="30px"
          h="30px"
          bg="blue.400"
          borderRadius="full"
          transition="bottom 0.1s ease"
          boxShadow="2px 2px 8px rgba(0, 0, 0, 0.3)"
        />
      )}

      <Center
        position="absolute"
        left="50%"
        transform="translate(-50%, -50%)"
        bottom={`${holePosition}%`}
        w="50px"
        h="50px"
        bg="white"
        borderRadius="full"
        border="4px solid black"
        transition="border-color 0.3s ease"
      />
    </Box>
  );
};

export default VocalGauge;
