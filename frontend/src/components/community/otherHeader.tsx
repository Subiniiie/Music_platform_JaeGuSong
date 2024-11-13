import React, { useEffect, useRef, useState } from "react";
import { Box, Text, Button, Input, VStack, Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Modal from "../common/Modal";
import { useChat } from "@/hooks/chat/useChat";

// 시간 포맷팅 함수
const formatMessageTime = (createdAt: string) => {
  const messageDate = new Date(createdAt);

  // 시간만 추출 (HH:mm)
  const hours = messageDate.getHours().toString().padStart(2, "0");
  const minutes = messageDate.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

const OtherHeader: React.FC = () => {
  const location = useLocation();
  const { artistSeq, otherNickname, otherProfileImage } = location.state || {};
  localStorage.setItem("OtherUserSeq", artistSeq);
  const authStorage = localStorage.getItem("auth-storage");
  const userSeq = authStorage
    ? JSON.parse(authStorage)?.state?.artistSeq
    : null;

  const jwtToken = localStorage.getItem("jwtToken");
  const API_URL = import.meta.env.VITE_API_URL;

  const {
    chatMessages,
    isChatModalOpen,
    inputMessage,
    setInputMessage,
    setIsChatModalOpen,
    handleCreateChat,
    handleSendMessage,
    chatRoomUsers,
  } = useChat({ jwtToken, API_URL, userSeq, OtherUserSeq: artistSeq });

  const messageEndRef = useRef<HTMLDivElement>(null);
  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

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
          {/* 프로필 이미지 */}
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
          {/* 팔로우 및 채팅 버튼 */}
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
            onClick={() => handleCreateChat()}
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

      {/* 채팅 모달 */}
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
            {/* 대화 상대의 닉네임을 렌더링 */}
            <Text fontSize="24px" fontWeight="bold" marginBottom="20px">
              채팅방
            </Text>

            {/* 채팅 메시지 리스트 */}
            <VStack
              align="flex-start"
              marginTop="4"
              flex="1"
              overflowY="auto"
              marginBottom="100px"
            >
              {chatMessages.map((message: any, index: number) => (
                <Flex
                  key={index}
                  bg={
                    String(message.artistSeq) === String(userSeq)
                      ? "skyblue"
                      : "gray.100"
                  }
                  p="2"
                  borderRadius="md"
                  alignSelf={
                    String(message.artistSeq) === String(userSeq)
                      ? "flex-end"
                      : "flex-start"
                  }
                  color={
                    String(message.artistSeq) === String(userSeq)
                      ? "blue500"
                      : "black"
                  }
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  {/* 시간 */}
                  <Text fontSize="xs" color="gray.500" marginRight="10px">
                    {formatMessageTime(message.createdAt)}
                  </Text>

                  {/* 메시지 내용 */}
                  <Text fontSize="sm" flex="1">
                    {message.msg}
                  </Text>
                </Flex>
              ))}

              <div ref={messageEndRef} />
            </VStack>

            {/* 입력창 */}
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
  );
};

export default OtherHeader;
