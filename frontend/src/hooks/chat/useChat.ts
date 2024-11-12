import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  msg: string;
  createdAt: string;
}

export interface User {
  id: string;
  userName: string;
}

const useChat = (API_URL: string) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Mock 사용자 데이터
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

  // 메시지 전송 함수
  const sendMessage = async () => {
    const senderSeq = getArtistSeq();
    if (!senderSeq || !message.trim() || !selectedChatUser) return;

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
        },
      });

      console.log(response.data);

      setMessages((prevMessages) => [...prevMessages, payload]);
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return {
    modalOpen,
    setModalOpen,
    selectedChatUser,
    setSelectedChatUser,
    message,
    setMessage,
    messages,
    mockUsers,
    sendMessage,
    messagesEndRef,
  };
};

export default useChat;
