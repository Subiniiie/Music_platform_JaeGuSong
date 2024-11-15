import React, { useEffect, useRef, useState } from "react";
import { Flex, VStack, Text, Input, Button, Box } from "@chakra-ui/react";
import Modal from "../common/Modal";

interface ChatRoomUser {
  artistSeq: string;
  nickname: string;
  profilePicUrl: string;
}

interface ChatModalProps {
  isChatModalOpen: boolean;
  setIsChatModalOpen: (isOpen: boolean) => void;
  chatMessages: any[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleLeaveChat: () => void;
  userSeq: number | null;
  jwtToken: string | null;
  API_URL: string;
  OtherUserSeq: number | null;
  OtherProfile: string | null;
  OtherName: string | null;
  roomSeq: number | null;
  chatRoomUsers: ChatRoomUser | null;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isChatModalOpen,
  setIsChatModalOpen,
  chatMessages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleLeaveChat,
  chatRoomUsers,
  userSeq,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const formatMessageTime = (createdAt: string) => {
    const messageDate = new Date(createdAt);

    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes().toString().padStart(2, "0");

    const period = hours < 12 ? "오전" : "오후";
    const formattedHours = hours % 12 || 12;

    return `${period} ${formattedHours}:${minutes}`;
  };

  return (
    <>
      <Modal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)}>
        <Flex
          direction="column"
          width="600px"
          height="600px"
          position="relative"
        >
          {chatRoomUsers?.length > 0 &&
            chatRoomUsers.map((user) => (
              <Flex
                key={user.artistSeq}
                direction="row"
                alignItems="center"
                padding="10px"
              >
                <Box
                  width="60px"
                  height="60px"
                  borderRadius="full"
                  overflow="hidden"
                  marginRight="10px"
                >
                  <img
                    src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${user.profilePicUrl}`}
                    alt={`${user.nickname}의 프로필 이미지`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Text fontSize="20px" fontWeight="bold">
                  {user.nickname}
                </Text>
              </Flex>
            ))}

          <VStack
            align="flex-start"
            flex="1"
            overflowY="auto"
            marginBottom="100px"
            backgroundColor="gray.100"
            borderRadius="15px"
            css={{
              "&::-webkit-scrollbar": {
                width: "10px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}
          >
            {chatMessages.map((message, index) => {
              const isUserMessage =
                String(message.artistSeq) === String(userSeq);

              return (
                <Flex
                  key={index}
                  direction="column"
                  alignSelf={isUserMessage ? "flex-end" : "flex-start"}
                  maxWidth="70%"
                  marginBottom="5px"
                  padding="8px 12px"
                  borderRadius="15px"
                  position="relative"
                  fontFamily="MiceGothic"
                  bg={isUserMessage ? "blue.500" : "gray.200"}
                  color={isUserMessage ? "white" : "black"}
                  boxShadow="md"
                  borderBottomLeftRadius={isUserMessage ? "30px" : "0"}
                  borderBottomRightRadius={isUserMessage ? "0" : "30px"}
                  marginRight={isUserMessage ? "10px" : 0}
                  marginLeft={isUserMessage ? 0 : "10px"}
                  textAlign={isUserMessage ? "right" : "left"}
                  marginTop="5px"
                >
                  <Text fontSize="16px" wordBreak="break-word">
                    {message.msg}
                  </Text>
                  <Text
                    fontSize="12px"
                    color={isUserMessage ? "gray.100" : "gray.500"}
                    textAlign={isUserMessage ? "right" : "left"}
                    marginTop="5px"
                  >
                    {formatMessageTime(message.createdAt)}
                  </Text>
                </Flex>
              );
            })}
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
          >
            <Input
              placeholder="메시지를 입력하세요"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              marginRight="10px"
              flex="1"
              borderRadius="20px"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}>
              <Text fontFamily="MiceGothicBold">전송</Text>
            </Button>
          </Flex>

          <Button
            colorScheme="red"
            position="absolute"
            right="30px"
            fontFamily="MiceGothicBold"
            onClick={() => setIsConfirmModalOpen(true)}
          >
            채팅방 나가기
          </Button>
        </Flex>
      </Modal>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          padding="20px"
          width="300px"
          height="250px"
        >
          <Text
            fontSize="18px"
            marginBottom="30px"
            textAlign="center"
            fontWeight="bold"
          >
            채팅기록이 완전히 삭제 됩니다. 그래도 나가시겠습니까 ?
          </Text>
          <Flex justify="space-between" width="100%" gap="0" marginTop="20px">
            <Button
              colorScheme="red"
              width="40%"
              fontWeight="bold"
              onClick={() => {
                handleLeaveChat();
                setIsConfirmModalOpen(false);
                setIsChatModalOpen(false);
              }}
            >
              예
            </Button>
            <Button
              width="40%"
              fontWeight="bold"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              아니오
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};

export default ChatModal;
