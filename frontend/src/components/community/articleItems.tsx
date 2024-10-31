import React from 'react';
import { ArticleItem } from '@/configs/community/articleItem';
import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import paths from '@/configs/paths';

interface ArticleItemsProps {
  article: ArticleItem;
}

const ArticleItems: React.FC<ArticleItemsProps> = ({ article }) => {
  const navigate = useNavigate();


  const goDetail = () => {
    console.log('board_seq:', article.board_seq)
    navigate(paths.community.detail(article.board_seq));
  };

  return (
    <Box onClick={goDetail}>
      <Text textStyle="xl">{article.title}</Text>
    </Box>
  );
};

export default ArticleItems;