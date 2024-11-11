import React from "react";
import { ArticleItem } from "@/configs/community/articleItem";
import { Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";

interface ArticleItemsProps {
  boardSeq: number;  // 숫자로 articleSeq를 받음
}


const ArticleItems: React.FC<ArticleItemsProps> = ({ boardSeq }) => {
  const navigate = useNavigate();

  const goDetail = () => {
    console.log("Navigating to:", paths.community.detail(boardSeq));
    navigate(paths.community.detail(boardSeq));
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
      {/* <Text textStyle="xl">{article.title}</Text> */}
      <Text textStyle="xl">제목</Text>
    </Box>
  );
};

export default ArticleItems;
