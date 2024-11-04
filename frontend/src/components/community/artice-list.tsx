import React, { useEffect } from 'react';
import { Separator, Stack  } from '@chakra-ui/react';
import ArticleItems from './articleItems';
import useCommunityMain from '@/hooks/community/useCommunityMain';
const ArticleList: React.FC = () => {
  const {
    getArticleList
  } = useCommunityMain();

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
    getArticleList();
  }, [])

  return (
    <Stack 
      marginTop="10px"
    >
      {articles.map((article) => (
        <Separator
          key={article.board_seq}
          size="xs" 
          borderColor="#c5e4f3"
        >
          <ArticleItems article={article} />
        </Separator>
      ))}
    </Stack>
  );
};

export default ArticleList;