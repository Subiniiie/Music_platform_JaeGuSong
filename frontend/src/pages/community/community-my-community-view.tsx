import React, { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Header from "@/components/community/header";
import Container from "@/components/community/container";
import ArticleList from "@/components/community/artice-list";
import ArticleMusicList from "@/components/community/article-music-list";
import CommunityButton2 from "@/components/community/community-button-2";
import useCommunityMain from "@/hooks/community/useCommunityMain";

const CommunityMyCommunityView: React.FC = () => {
  const { feedState, goMusicMainFeed, goMainFeed } = useCommunityMain();
  return (
    <Box>
      <Header />
      <Container>
        <Box
          padding="20px"
          borderRadius="10px"
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            marginBottom="10px"
          >
            <Box>
              <CommunityButton2
                title="피드"
                onClick={goMainFeed}
                variant="solid"
                size="sm"
                marginRight="10px"
              />
              <CommunityButton2
                title="음원 피드"
                onClick={goMusicMainFeed}
                variant="solid"
                size="sm"
              />
            </Box>
          </Flex>

          <Box marginBottom="20px">
            {/* 콘텐츠 표시 */}
            {feedState ? <ArticleList /> : <ArticleMusicList />}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CommunityMyCommunityView;
