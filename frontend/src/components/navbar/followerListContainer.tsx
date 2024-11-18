import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { FollowUserList } from '@/hooks/navbar/useFollow';
import useFollow from '@/hooks/navbar/useFollow';

interface FollowingListContainerProps {
    followerUserList: FollowUserList[]; // 배열 타입으로 지정
  }

const FollowerListContainer: React.FC<FollowingListContainerProps> = ({ followerUserList }) => {
    const { goOtherUserFeed } = useFollow();
  return (
    <Box marginTop="30px" width="100%">
    {followerUserList.length > 0 ? (
      followerUserList.map((user) => (
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
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
        </Box>
      ))
    ) : (
      <Text>나를 팔로우한 유저가 없습니다.</Text>
    )}
  </Box>
  );
};

export default FollowerListContainer;