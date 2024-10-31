import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, Input, Box, Text, Flex } from "@chakra-ui/react";
import Modal from "@/components/common/Modal";

const Chat = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [userCount, setUserCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(
    sessionStorage.getItem("userId")
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBar, setShowScrollBar] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
      const newMessage = { id, userId, msg };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    }
  };

  const sendMessage = () => {
    if (!userId || !message.trim()) return;
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
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = () => {
    setShowScrollBar(true);
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
      setShowScrollBar(false);
    }, 1000);
  };

  return (
    <>
      <Button onClick={handleChatButtonClick} disabled={modalOpen}>
        💬
      </Button>

      <Modal isOpen={modalOpen} onClose={closeModal}>
        <Text mb={4}>현재 인원: {userCount}</Text>
        <Box maxH="300px" overflowY="scroll" onScroll={handleScroll} mb={4}>
          {messages.map((msg, index) => (
            <Flex
              key={index}
              alignSelf={msg.userId === userId ? "flex-end" : "flex-start"}
              p={2}
              bg={msg.userId === userId ? "green.200" : "gray.200"}
              borderRadius="md"
              mb={2}
              maxW="70%"
            >
              <Text>{msg.msg}</Text>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메세지 입력"
          mb={2}
        />

        <Button onClick={sendMessage} disabled={!userId} mr={3}>
          전송
        </Button>
        <Button onClick={clearMessages}>전체 메세지 삭제</Button>
      </Modal>
    </>
  );
};

export default Chat;
