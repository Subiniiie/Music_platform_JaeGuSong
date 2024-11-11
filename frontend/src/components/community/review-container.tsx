import React from 'react';
import { Box, Stack, Separator, Text } from "@chakra-ui/react"

interface ReviewcontainerProps {
  comments: any[];
}

const Reviewcontainer: React.FC<ReviewcontainerProps> = ({ comments }) => {
  return (
    <Box marginBottom="500px">
    <Stack>
      <Separator size="xs" marginTop="20px" />
      <Text marginLeft="10px">댓글</Text>
      <Separator size="xs" />
      {comments.length === 0 ? (
        <Text marginLeft="10px">등록된 댓글이 없습니다.</Text>
      ) : (
        <Text>등록된 댓글이 있습니다.</Text>
      )}
    </Stack>
    </Box>
  );
};

export default Reviewcontainer;