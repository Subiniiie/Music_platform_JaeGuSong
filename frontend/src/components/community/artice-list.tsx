import React, { useState, useEffect } from 'react';
import { Box, Separator, Stack  } from '@chakra-ui/react';
import ArticleItems from './articleItems';

const ArticleList: React.FC = () => {
  const articles = [
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
  ]

  //게시물이 새로 생성될 때마다 목록 요청
  useEffect(() => {
    const getArticleList = async () => {
      // 토큰 가져오기
      // try {
      //   const response = await axios.get(`${API_URL}/api/boards/{userSeq}`),
      //   headers: {
      //     access: `${token}`
      //   },
      // } catch(error) {
      //   console.error(error)
      // }
    }  
    getArticleList();
  }, [])

  return (
    <Stack gap="10">
      {articles.map((article) => (
        <Separator
          key={article.board_seq}
          size="xs" 
        >
          <ArticleItems article={article} />
        </Separator>
      ))}
    </Stack>
  );
};

export default ArticleList;