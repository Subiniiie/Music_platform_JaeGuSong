import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useChat } from "@/hooks/chat/useChat";
import ChatModal from "../chat/chat";

const OtherHeader: React.FC = () => {
  const location = useLocation();
  const { artistSeq, otherNickname, otherProfileImage } = location.state || {};
  const authStorage = localStorage.getItem("auth-storage");
  const userSeq = authStorage
    ? JSON.parse(authStorage)?.state?.artistSeq
    : null;

  const jwtToken = localStorage.getItem("jwtToken");
  const API_URL = import.meta.env.VITE_API_URL;
  const {
    isChatModalOpen,
    setIsChatModalOpen,
    handleCreateChat,
    ...chatProps
  } = useChat({
    jwtToken,
    API_URL,
    userSeq,
    OtherUserSeq: artistSeq,
  });

  return (
    <Box
      position="fixed"
      top="0"
      left="250px"
      width="calc(100% - 250px)"
      padding="4"
      boxShadow="md"
      zIndex={10}
    >
      <Box height="70px">
        <Box display="flex" flexDirection="row" alignItems="center" gap="15px">
          <Box
            width="70px"
            height="70px"
            borderRadius="full"
            overflow="hidden"
            border="2px solid #fff"
            boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
          >
            <img
              src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${otherProfileImage}`}
              alt={`${otherNickname}의 프로필 이미지`}
            />
          </Box>
          <Text textStyle="3xl" fontWeight="bold" color="white">
            {otherNickname}
          </Text>
          <Text textStyle="xl" color="whiteAlpha.800">
            님의 피드
          </Text>
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
          <Button
            onClick={handleCreateChat}
            border="solid 2px #9000FF"
            borderRadius="15px"
            height="30px"
            width="100px"
            _hover={{
              color: "#9000ff",
              border: "solid 2px white",
            }}
          >
            채팅
          </Button>
        </Box>
      </Box>
      {isChatModalOpen && (
        <ChatModal
          {...chatProps}
          isChatModalOpen={isChatModalOpen}
          setIsChatModalOpen={setIsChatModalOpen}
          userSeq={userSeq}
          jwtToken={jwtToken}
          API_URL={API_URL}
          OtherUserSeq={artistSeq}
          OtherProfile={otherProfileImage}
          OtherName={otherNickname}
        />
      )}
    </Box>
  );
};

export default OtherHeader;
