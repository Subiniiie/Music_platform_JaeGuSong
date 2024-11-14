import React, { useEffect, useRef } from "react";
import { Flex, VStack, Text, Input, Button, Box } from "@chakra-ui/react";
import Modal from "../common/Modal";

interface ChatModalProps {
  isChatModalOpen: boolean;
  setIsChatModalOpen: (isOpen: boolean) => void;
  chatMessages: any[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  userSeq: number | null;
  jwtToken: string | null;
  API_URL: string;
  OtherUserSeq: number | null;
  OtherProfile: string | null;
  OtherName: string | null;
  roomSeq: number | null;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isChatModalOpen,
  setIsChatModalOpen,
  chatMessages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  userSeq,
  roomSeq,
  //   jwtToken,
  //   API_URL,
  //   OtherUserSeq,
  OtherProfile,
  OtherName,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const formatMessageTime = (createdAt: string) => {
    const messageDate = new Date(createdAt);
    const hours = messageDate.getHours().toString().padStart(2, "0");
    const minutes = messageDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <Modal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)}>
      <Flex direction="column" width="600px" height="600px" position="relative">
        {OtherProfile && (
          <Flex
            direction="row"
            alignItems="center"
            marginBottom="20px"
            padding="10px"
            borderBottom="1px solid #ddd"
          >
            <Box
              width="50px"
              height="50px"
              borderRadius="full"
              overflow="hidden"
              marginRight="10px"
              border="2px solid #9000FF"
            >
              <img
                src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${OtherProfile}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Text fontSize="20px" fontWeight="bold">
              {OtherName}
            </Text>
          </Flex>
        )}

        <VStack
          align="flex-start"
          marginTop="4"
          flex="1"
          overflowY="auto"
          marginBottom="100px"
        >
          {chatMessages.map((message, index) => (
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
                  ? "white"
                  : "black"
              }
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Text fontSize="12px" color="gray.500" marginRight="10px">
                {formatMessageTime(message.createdAt)}
              </Text>
              <Text fontSize="16px" flex="1" fontWeight="bold">
                {message.msg}
              </Text>
            </Flex>
          ))}
          <div ref={messageEndRef} />
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
  );
};

export default ChatModal;
