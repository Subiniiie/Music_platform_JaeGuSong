import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, Input, Box, Text, Flex, VStack } from "@chakra-ui/react";
import axios from "axios";
import Modal from "@/components/common/Modal";

interface Message {
  id: string;
  sender: string;
  receiver: string;
  msg: string;
  createdAt: string;
}

interface User {
  id: string;
  userName: string;
}

const Chat = () => {
  const [message, setMessage] = useState<string>(""); // 입력 메시지 상태
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false); // 모달 열림 상태
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null); // 선택된 사용자
  const API_URL = import.meta.env.VITE_API_URL;

  // 임의 유저 데이터
  const mockUsers: User[] = [
    { id: uuidv4(), userName: "송중기" },
    { id: uuidv4(), userName: "이민호" },
  ];

  // localStorage에서 artistSeq 가져오기
  const getArtistSeq = () => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const parsedData = JSON.parse(authStorage);
        return parsedData?.state?.artistSeq || null;
      } catch (error) {
        console.error("Error parsing auth-storage:", error);
        return null;
      }
    }
    return null;
  };

  // localStorage에서 JWT 토큰 가져오기
  const getJwtToken = () => {
    return localStorage.getItem("jwtToken");
  };

  // 메시지 전송 함수
  const sendMessage = async () => {
    const senderSeq = getArtistSeq();
    const jwtToken = getJwtToken();

    if (!senderSeq || !message.trim() || !selectedChatUser || !jwtToken) {
      console.error();
      return;
    }

    const payload: Message = {
      id: uuidv4(),
      sender: senderSeq.toString(),
      receiver: "1",
      msg: message,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`${API_URL}/api/chats`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log("Message sent:", response.data);

      // 로컬 메시지 목록 업데이트
      setMessages((prevMessages) => [...prevMessages, payload]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <img
        src="/assets/chat.png"
        alt="Open Chat"
        onClick={() => setModalOpen(true)}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          cursor: "pointer",
          width: "60px",
          height: "60px",
          transition: "0.3s",
        }}
      />

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <Flex direction="column" width="600px" height="800px">
            {!selectedChatUser ? (
              <VStack
                spacing={4}
                p={4}
                maxH="calc(100% - 60px)"
                overflowY="auto"
                bg="white"
              >
                {mockUsers.map((user) => (
                  <Button
                    key={user.id}
                    onClick={() => setSelectedChatUser(user)}
                    width="100%"
                    bg="blue.50"
                    _hover={{ bg: "blue.100" }}
                  >
                    {user.userName}
                  </Button>
                ))}
              </VStack>
            ) : (
              <>
                <Flex p={4} bg="gray.100" alignItems="center">
                  <Button
                    onClick={() => setSelectedChatUser(null)}
                    bg="gray.300"
                    _hover={{ bg: "gray.400" }}
                  >
                    Back
                  </Button>
                  <Text ml={4} fontWeight="bold" color="black">
                    {selectedChatUser.userName}님과의 채팅방
                  </Text>
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
                      alignSelf={
                        msg.sender === getArtistSeq()?.toString()
                          ? "flex-end"
                          : "flex-start"
                      }
                      p={3}
                      bg={
                        msg.sender === getArtistSeq()?.toString()
                          ? "skyblue"
                          : "#e5e5ea"
                      }
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
                  <Button onClick={sendMessage} ml={2}>
                    전송
                  </Button>
                </Flex>
              </>
            )}
          </Flex>
        </Modal>
      )}
    </>
  );
};

export default Chat;
