import React from "react";
import { Box, Flex, Text, Button, Input } from "@chakra-ui/react";
import { Message, User } from "../../hooks/chat/useChat";

interface ChatRoomProps {
  selectedChatUser: User;
  messages: Message[];
  message: string;
  setMessage: (value: string) => void;
  onSendMessage: () => void;
  onBack: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  selectedChatUser,
  messages,
  message,
  setMessage,
  onSendMessage,
  onBack,
  messagesEndRef,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSendMessage();
    }
  };

  return (
    <>
      <Flex
        p={4}
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid #e0e0e0"
      >
        <Button
          onClick={onBack}
          bg="transparent"
          p="0"
          _hover={{ bg: "transparent" }}
        >
          <img
            src="/assets/back.png"
            alt="Back"
            style={{
              width: "20px",
              height: "20px",
              marginRight: "35px",
              marginBottom: "30px",
            }}
          />
        </Button>

        <Text
          fontWeight="bold"
          color="black"
          fontSize="18px"
          flex="1"
          textAlign="center"
        >
          {selectedChatUser.userName}님과의 채팅방
        </Text>

        <Box width="20px" height="20px" />
      </Flex>

      <Box
        flex="1"
        overflowY="auto"
        p={4}
        bg="#f0f0f0"
        id="messages"
        display="flex"
        flexDirection="column"
      >
        {messages.map((msg) => (
          <Flex
            key={msg.id}
            alignSelf={msg.sender === "123" ? "flex-end" : "flex-start"}
            p={3}
            bg={msg.sender === "123" ? "skyblue" : "#e5e5ea"}
            borderRadius="20px"
            mb={2}
          >
            <Text color="black">{msg.msg}</Text>
          </Flex>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Flex>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메세지 입력"
          style={{
            color: "black",
          }}
        />
        <Button onClick={onSendMessage} ml={2}>
          전송
        </Button>
      </Flex>
    </>
  );
};

export default ChatRoom;
