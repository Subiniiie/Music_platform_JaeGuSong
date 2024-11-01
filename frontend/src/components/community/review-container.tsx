import React from 'react';
import { Box, Stack, Separator, Text } from "@chakra-ui/react"

const Reviewcontainer: React.FC = () => {
  return (
    <Box>
    <Stack>
      <Separator size="xs" marginTop="20px" />
      <Text>댓글</Text>
      <Separator size="xs" />
    </Stack>
    </Box>
  );
};

export default Reviewcontainer;