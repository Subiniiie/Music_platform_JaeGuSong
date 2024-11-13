import React from "react";
import { Box, Text, Button, Input, VStack, Flex } from "@chakra-ui/react";
import Modal from "../common/Modal";
import { useChat } from "@/hooks/chat/useChat";

interface OtherHeaderProps {
  otherUserNickname: string;
  otherUserProfileImage: string;
  OtheruserSeq: number;
}

const OtherHeader: React.FC<OtherHeaderProps> = ({
  otherUserNickname,
  otherUserProfileImage,
  OtheruserSeq,
}) => {
  const authStorage = localStorage.getItem("auth-storage");
  const userSeq = authStorage
    ? JSON.parse(authStorage)?.state?.artistSeq
    : null;

  const jwtToken = localStorage.getItem("jwtToken");
  const API_URL = import.meta.env.VITE_API_URL;
  const {
    roomSeq,
    chatMessages,
    isChatModalOpen,
    inputMessage,
    setInputMessage,
    setIsChatModalOpen,
    handleCreateChat,
    handleSendMessage,
  } = useChat({ jwtToken, API_URL, userSeq });

  return (
    <Box
      position="fixed"
      top="0"
      left="250px"
      width="calc(100% - 250px)"
      padding="4"
      boxShadow="md" // 그림자 추가
      zIndex={10} // 헤더가 항상 상단에 오도록 설정
    >
      <Box height="70px">
        <Box display="flex" flexDirection="row" alignItems="center" gap="5px">
          <Box width="70px" height="70px">
            <img
              src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${otherUserProfileImage}`}
              alt={`${otherUserProfileImage}`}
            />
          </Box>
          <Text textStyle="3xl" marginTop="10px">
            {otherUserNickname}
          </Text>
          <Text textStyle="xl" marginTop="10px">
      boxShadow="md" // 그림자 추가
      zIndex={10} // 헤더가 항상 상단에 오도록 설정
    >
      <Box
        height="70px"
      >
        <Box 
          display="flex" 
          flexDirection="row" 
          alignItems="center"
          gap="15px"
        >
          <Box
            width="70px"
            height="70px"
            borderRadius="full" // 프로필 이미지를 원형으로
            overflow="hidden"
            border="2px solid #fff" // 테두리 추가
            boxShadow="0 0 10px rgba(0, 0, 0, 0.2)" 
          >
            <img src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${otherUserProfileImage}`} alt={`${otherUserProfileImage}`}></img>
          </Box>            
          <Text
            textStyle="3xl"
            fontWeight="bold"
            color="white"
            marginTop="10px"
            noOfLines={1}
          >
            {otherUserNickname}
          </Text>
          <Text
            textStyle="xl"
            color="whiteAlpha.800"
            marginTop="5px"
            noOfLines={1}
          >
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
            onClick={() => handleCreateChat(OtheruserSeq)}
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
        <Modal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
        >
          <Flex
            direction="column"
            width="600px"
            height="600px"
            position="relative"
          >
            <Text fontSize="24px" fontWeight="bold" marginBottom="20px">
              채팅방
            </Text>

            <VStack align="flex-start" marginTop="4" flex="1" overflowY="auto">
              {chatMessages.map((message, index) => (
                <Box
                  key={index}
                  bg="gray.100"
                  p="2"
                  borderRadius="md"
                  alignSelf="flex-start"
                >
                  {message}
                </Box>
              ))}
            </VStack>

            <Flex
              alignItems="center"
              position="absolute"
              bottom="0"
              left="0"
              width="100%"
              padding="10px"
              background="white"
              borderTop="1px solid #ddd"
            >
              <Input
                placeholder="메시지를 입력하세요"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                marginRight="10px"
                flex="1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <Button colorScheme="blue" onClick={handleSendMessage}>
                전송
              </Button>
            </Flex>
          </Flex>
        </Modal>
      )}
    </Box>
    </Box>
  );
};

export default OtherHeader;
