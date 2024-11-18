import React, { useEffect } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { FollowUserList } from "@/hooks/navbar/useFollow";
import useFollow from "@/hooks/navbar/useFollow";

interface FollowingListContainerProps {
  followingUserList: FollowUserList[]; // 배열 타입으로 지정
}

const FollowingListContainer: React.FC<FollowingListContainerProps> = ({
  followingUserList,
}) => {
  const { goOtherUserFeed, goUnfollow } = useFollow();

  return (
    <Box marginTop="10px" width="100%">
      {followingUserList.length > 0 ? (
        followingUserList.map((user) => (
          <Box
            key={user.artistSeq}
            display="flex"
            alignItems="center"
            marginBottom="10px"
            cursor="pointer"
            onClick={() => goOtherUserFeed(user.artistSeq)}
          >
            <Box
              width="30px"
              height="30px"
              borderRadius="50%"
              overflow="hidden"
            >
              <img
                src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${user.thumbnail}`}
                alt={user.nickname}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Text
              marginLeft="10px"
              fontSize="14px"
              fontWeight="medium"
              flex="1"
            >
              {user.nickname}
            </Text>
            <Button
              size="xs"
              backgroundColor="rgba(255, 99, 71, 0.2)" // 은은한 빨간 배경
              color="rgba(255, 69, 0, 0.8)" // 텍스트 색상
              _hover={{ backgroundColor: "rgba(255, 69, 0, 0.3)" }} // 호버 효과
              _active={{ backgroundColor: "rgba(255, 69, 0, 0.5)" }} // 클릭 효과
              onClick={() => goUnfollow(user.artistSeq)}
            >
              언팔로우
            </Button>
          </Box>
        ))
      ) : (
        <Text>팔로우한 유저가 없습니다.</Text>
      )}
    </Box>
  );
};

export default FollowingListContainer;
