import React from "react";
import { ArticleItem } from "@/configs/community/articleItem";
import { Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";

interface ArticleItemsProps {
  article: ArticleItem;
}

const ArticleItems: React.FC<ArticleItemsProps> = ({ article }) => {
  const navigate = useNavigate();

  const goDetail = () => {
    console.log("Navigating to:", paths.community.detail(article.board_seq));
    navigate(paths.community.detail(article.board_seq));
    console.log("갔다왔다");
  };

  return (
    <Box
      onClick={goDetail}
      display="flex"
      alignItems="center"
      height="50px"
      paddingLeft="10px"
      cursor="pointer"
    >
      <Text textStyle="xl">{article.title}</Text>
    </Box>
  );
};

export default ArticleItems;
