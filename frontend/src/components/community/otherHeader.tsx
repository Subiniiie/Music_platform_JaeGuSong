import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

interface OtherHeaderProps {
    otherUserNickname: string;
    otherUserProfileImage: string;
  }

const OtherHeader: React.FC<OtherHeaderProps>  = ({ otherUserNickname, otherUserProfileImage }) => {

  return (
    <Box
        position="fixed"
        top="0"
        left="250px"
        width="calc(100% - 250px)" 
        padding="4"
    >
      <Box
        height="70px"
      >
        <Box 
          display="flex" 
          flexDirection="row" 
          alignItems="center"
          gap="5px"
        >
          <Box width="70px" height="70px">
            <img src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${otherUserProfileImage}`} alt={`${otherUserProfileImage}`}></img>
          </Box>            
          <Text textStyle="3xl" marginTop="10px">{otherUserNickname}</Text>
          <Text textStyle="xl" marginTop="10px">님의 피드</Text>
          <Button
            border="solid 2px #9000FF"
            borderRadius="15px"
            height="30px"
            width="80px"
            _hover={{
              color: "#9000ff",
              border: "solid 2px white",
            }}
          >
            팔로우
          </Button>
        </Box>          
      </Box>        
      <Box 
        marginTop="20px"
        marginRight="20px"
        display="flex"
        justifyContent="flex-end"
        gap="5px"
      >
      </Box>        
    </Box>
  );
};

export default OtherHeader;