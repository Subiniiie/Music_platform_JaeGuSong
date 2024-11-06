import React from 'react';
import { Box, Button, Flex } from "@chakra-ui/react"
import useCommunityMusic from '@/hooks/community/useCommunityMusic';

const ArticleMusicList: React.FC = () => {
    const {
        goMusicFeedDetail
    } = useCommunityMusic();

    const musicArticles = [
        { board_seq: 1,
          user_seq: 1,
          user_nickname: '수빈',
          user_profile_image: '/profileImage.png',
          title: '제목1',
          state: 'PUBLIC',
          likeNum: 3,
          isLiked: 'YET',
          thumbnail: '이미지를 그대로 내려보내줄거야??'
        },
        { board_seq: 2,
          user_seq: 2,
          user_nickname: '수빈',
          user_profile_image: '/profileImage.png',
          title: '제목2',
          state: 'PUBLIC',
          likeNum: 3,
          isLiked: 'YET',
          thumbnail: '이미지를 그대로 내려보내줄거야??'
        },
        { board_seq: 3,
          user_seq: 2,
          user_nickname: '수빈',
          user_profile_image: '/profileImage.png',
          title: '제목2',
          state: 'PUBLIC',
          likeNum: 3,
          isLiked: 'YET',
          thumbnail: '이미지를 그대로 내려보내줄거야??'
        },
        { board_seq: 4,
          user_seq: 2,
          user_nickname: '수빈',
          user_profile_image: '/profileImage.png',
          title: '제목2',
          state: 'PUBLIC',
          likeNum: 3,
          isLiked: 'YET',
          thumbnail: '이미지를 그대로 내려보내줄거야??'
        },
      ]
  return (
    <Box                
        height="800px"
        overflowY="auto"
        css={{
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#e3f2f9',
                borderRadius: '20px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#02001F',
                borderRadius: '20px',
            },
        }}
    >
    <Flex
    wrap="wrap" 
    margin="60px 200px"
    gap="30px"

>
    {musicArticles.map((article) => (
        <Button
            key={article.board_seq}
            size="xs"
            variant="outline" 
            borderColor="#c5e4f3"
            width="300px"
            height="350px"
            color="white"
            onClick={() => goMusicFeedDetail(article)}
        >
            {article.title}
        </Button>
    ))}
</Flex>
</Box>
  );

};

export default ArticleMusicList;