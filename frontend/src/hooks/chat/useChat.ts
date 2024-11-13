import { useEffect, useState, useRef } from "react";
import axios from "axios";

interface ChatMessage {
  artistSeq: number;
  roomSeq: number;
  msg: string;
}

interface UseChatProps {
  jwtToken: string | null;
  API_URL: string;
  userSeq: number | null;
  OtherUserSeq: number | null;
}

export const useChat = ({
  jwtToken,
  API_URL,
  userSeq,
  OtherUserSeq,
}: UseChatProps) => {
  const [roomSeq, setRoomSeq] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [chatRoomUsers, setChatRoomUsers] = useState<any[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  // 채팅 생성
  const handleCreateChat = async () => {
    if (!jwtToken || !userSeq || !OtherUserSeq) {
      console.error("채팅 생성 실패: 필요한 정보가 누락되었습니다.");
      return;
    }

    const data = {
      receiversSeq: [OtherUserSeq],
      senderSeq: userSeq,
    };

    try {
      const response = await axios.post(`${API_URL}/api/chats/single`, data, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      setRoomSeq(response.data);
      setIsChatModalOpen(true);
    } catch (error) {
      console.error("채팅 생성 실패:", error);
    }
  };

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!jwtToken || !roomSeq || inputMessage.trim() === "") return;

    const data: ChatMessage = {
      artistSeq: userSeq!,
      roomSeq: roomSeq!,
      msg: inputMessage,
    };

    try {
      await axios.post(`${API_URL}/api/chats/webflux`, data, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      setInputMessage("");
      console.log("hihihihi");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  // 채팅방 유저 누구있는지 ?
  const handleFetchChatRoomUsers = () => {
    const eventSource = new EventSource(
      `${API_URL}/api/chats/webflux/artistInfo/${roomSeq}`
    );

    eventSource.onmessage = (event) => {
      const users = JSON.parse(event.data);
      setChatRoomUsers(users);
      console.log("채팅방 유저 정보 수신:", users);
    };

    eventSource.onerror = (error) => {
      console.error("SSE 에러:", error);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;
  };

  // 채팅 메시지 가져오기 (EventSource)
  const handleFetchMessages = () => {
    const eventSource = new EventSource(
      `${API_URL}/api/chats/webflux/${roomSeq}/${userSeq}`
    );
    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log("hihihi");
    };
    eventSource.onerror = (error) => {
      console.error("SSE 에러:", error);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;
  };

  useEffect(() => {
    if (roomSeq) {
      handleFetchMessages();
      handleFetchChatRoomUsers();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [roomSeq]);

  return {
    roomSeq,
    chatMessages,
    isChatModalOpen,
    inputMessage,
    setInputMessage,
    setIsChatModalOpen,
    handleCreateChat,
    handleSendMessage,
    chatRoomUsers,
  };
};
