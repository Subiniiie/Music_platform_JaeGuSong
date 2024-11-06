import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, Input, Box, Text, Flex, VStack } from "@chakra-ui/react";
import Modal from "@/components/common/Modal";

interface Message {
  id: string;
  userId: string;
  msg: string;
}

interface User {
  id: string;
  userName: string;
}

const Chat = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [userCount, setUserCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(
    sessionStorage.getItem("userId")
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);

  // 임의 유저 데이터 생성
  const mockUsers: User[] = [
    { id: uuidv4(), userName: "송중기" },
    { id: uuidv4(), userName: "이민호" },
    { id: uuidv4(), userName: "김수현" },
    { id: uuidv4(), userName: "전지현" },
    { id: uuidv4(), userName: "이종석" },
    { id: uuidv4(), userName: "박보검" },
    { id: uuidv4(), userName: "유아인" },
    { id: uuidv4(), userName: "한효주" },
    { id: uuidv4(), userName: "수지" },
    { id: uuidv4(), userName: "아이유" },
  ];

  const handleChatButtonClick = () => {
    if (modalOpen) {
      closeModal();
      return;
    }

    if (!socket || socket.readyState === WebSocket.CLOSED) {
      const ws = new WebSocket("ws://localhost:8080");

      ws.onopen = () => {
        console.log("웹소켓 연결");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleMessage(data);
      };

      ws.onclose = () => {
        console.log("웹소켓 연결 끊김");
        setSocket(null);
        setUserId(null);
        sessionStorage.removeItem("userId");
      };

      setSocket(ws);
    } else {
      console.log("웹소켓은 이미 연결되어 있습니다.");
    }

    setModalOpen(true);
  };

  const handleMessage = (data: any) => {
    if (data.type === "assignUserId") {
      if (!userId) {
        setUserId(data.userId);
        sessionStorage.setItem("userId", data.userId);
      }
    } else if (data.type === "userCount") {
      setUserCount(data.count);
    } else if (data.type === "chatHistory") {
      setMessages(data.messages);
      localStorage.setItem("messages", JSON.stringify(data.messages));
    } else {
      const { id, userId, message: msg } = data;
      const newMessage: Message = { id, userId, msg };
      setMessages((prevMessages: Message[]) => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    }
  };

  const openChatRoom = (user: User) => {
    setSelectedChatUser(user); // 채팅할 유저 선택
  };

  const sendMessage = () => {
    if (!userId || !message.trim() || !selectedChatUser) return;
    const id = uuidv4();
    const payload = { id, userId, message };
    socket?.send(JSON.stringify(payload));
    setMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("messages");
    socket?.send(JSON.stringify({ type: "clearMessages" }));
  };

  const closeSocket = () => {
    if (socket) {
      socket.close();
    }
  };

  const closeModal = () => {
    closeSocket();
    setModalOpen(false);
    setSelectedChatUser(null); // 모달 닫을 때 선택된 유저 초기화
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
        onClick={handleChatButtonClick}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          cursor: "pointer",
          width: "60px",
          height: "60px",
          transition: "0.3s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.6)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      />

      <Modal isOpen={modalOpen} onClose={closeModal}>
        <Flex
          direction="column"
          width="600px"
          height="800px"
          maxH="80vh"
          overflow="hidden"
        >
          {!selectedChatUser && (
            <Box
              p={4}
              borderBottom="1px solid #e0e0e0"
              bg="white"
              position="sticky"
              top="0"
              zIndex="1"
            >
              <Text
                fontSize="24px"
                fontWeight="bold"
                color="black"
                textAlign="left"
              >
                채팅
              </Text>
            </Box>
          )}

          {!selectedChatUser ? (
            <VStack
              spacing={4}
              p={4}
              maxH="calc(100% - 60px)"
              overflowY="auto"
              width="100%"
            >
              {mockUsers.map((user) => (
                <Button
                  key={user.id}
                  width="100%"
                  justifyContent="flex-start"
                  padding="24px"
                  height="auto"
                  bg="white"
                  borderBottom="1px solid #e0e0e0"
                  _hover={{ bg: "blue.50" }}
                  _active={{ bg: "blue.100" }}
                  onClick={() => openChatRoom(user)}
                >
                  <Flex alignItems="center">
                    <Box
                      bg="gray.300"
                      borderRadius="full"
                      width="40px"
                      height="40px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mr="3"
                    >
                      <Text fontSize="lg" fontWeight="bold" color="gray.600">
                        {user.userName.charAt(0)}
                      </Text>
                    </Box>
                    <Text fontSize="lg" fontWeight="bold" color="gray.700">
                      {user.userName}
                    </Text>
                  </Flex>
                </Button>
              ))}
            </VStack>
          ) : (
            <>
              <Flex
                p={4}
                justifyContent="center"
                alignItems="center"
                position="relative"
              >
                <button
                  onClick={() => setSelectedChatUser(null)}
                  style={{
                    position: "absolute",
                    left: "16px",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src="/assets/back.png"
                    style={{ width: "24px", height: "24px" }}
                  />
                </button>
                <Text
                  fontSize="24px"
                  fontWeight="bold"
                  color="black"
                  textAlign="center"
                >
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
                borderRadius="20px"
              >
                {messages.map((msg: Message) => (
                  <Flex
                    key={msg.id}
                    alignSelf={
                      msg.userId === userId ? "flex-end" : "flex-start"
                    }
                    p={3}
                    bg={msg.userId === userId ? "skyblue" : "#e5e5ea"}
                    borderRadius="20px"
                    mb={2}
                    color={msg.userId === userId ? "white" : "black"}
                  >
                    <Text>{msg.msg}</Text>
                  </Flex>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              <Box padding="20px 0 0 0">
                <Flex>
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메세지 입력"
                    color="black"
                    borderColor="#b0e0e6"
                    borderWidth="2px"
                    borderRadius="20px"
                    marginRight="10px"
                    _focus={{
                      borderColor: "#007acc",
                      boxShadow: "0 0 10px rgba(0, 122, 204, 0.5)",
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!userId}
                    borderRadius="20px"
                    bg="skyblue"
                    _hover={{
                      bg: "#007acc",
                    }}
                    marginRight="10px"
                  >
                    전송
                  </Button>
                  <Button onClick={clearMessages} borderRadius="20px">
                    메세지 삭제
                  </Button>
                </Flex>
              </Box>
            </>
          )}
        </Flex>
      </Modal>
    </>
  );
};

export default Chat;
