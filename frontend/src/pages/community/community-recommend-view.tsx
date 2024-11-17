import { Box, VStack } from "@chakra-ui/react";
import CommunityRecommendUser from "@/components/community/community-recommend-user";
import CommunityRecommendFollow from "@/components/community/community-recommend-follow";

const CommunityRecommendView: React.FC = () => {

  return (
    <Box padding="50px 10px 20px" height="100vh" overflowY="hidden">
      <Box height="100%">
        <VStack height="100%">
          <Box height="50%" width="100%">
            <CommunityRecommendUser />
          </Box>
          <Box height="50%" width="100%">
            <CommunityRecommendFollow />
          </Box>
        </VStack>
      </Box>
    </Box> 
  );
};

export default CommunityRecommendView;
