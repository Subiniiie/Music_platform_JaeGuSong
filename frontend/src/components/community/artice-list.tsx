import React, { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import useCommunityMain from '@/hooks/community/useCommunityMain';
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";

const ArticleList: React.FC = () => {
  const authStorage = localStorage.getItem("auth-storage");
  const navigate = useNavigate();
  const { id } = useParams<{id: string}>();
  
  const {
    myFeedArticleItems,
    getArticleList,
  } = useCommunityMain();

  let artistSeq: number | null = null;

  if (authStorage) {
    try {
      const parsedData = JSON.parse(authStorage);
      artistSeq = parsedData?.state?.artistSeq || null;
    } catch (error) {
      console.error("Failed to parse auth-storage:", error);
    }
  }


  useEffect(() => {
    if (id === undefined && artistSeq !== null) {
      getArticleList(artistSeq)
    } else if (id !== undefined) {
      getArticleList(parseInt(id))
    }
  }, [artistSeq]);

  useEffect(() => {
  }, [myFeedArticleItems]);
  

  const goDetail = (boardSeq: number) => {
    navigate(paths.community.detail(boardSeq));
  };
  
  return (
    <Box 
      height="800px" 
      overflowY="hidden"
      marginBottom="100px"
    >
      {myFeedArticleItems && myFeedArticleItems.flat().length > 0 ? (
        myFeedArticleItems.flat().map((myFeedArticleItem, index) => (
          <Box 
            key={index} 
            borderColor="#c5e4f3"
            cursor="pointer"
            onClick={() => goDetail(myFeedArticleItem.seq)}
            marginTop="-40px"
          >
            <Box display="flex" flexDirection="row" justifyContent="space-between" margin="60px 10px">
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="row">
                  <Text textStyle="2xl">{myFeedArticleItem.title}</Text>
                  <Text textStyle="sm" marginLeft="5px" color="#0d47a1">{myFeedArticleItem.state}</Text>
                </Box>                  
                <Text>댓글 {myFeedArticleItem.comments}개</Text>
              </Box>
            </Box>
          </Box>
        ))
      ) : (
        <Box marginTop="20px" marginLeft="20px">
          <p>게시물이 없습니다.</p>
        </Box>
      )}
    </Box>
  );
};

export default ArticleList;