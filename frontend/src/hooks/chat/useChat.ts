import { useEffect, useState } from "react";
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
}

export const useChat = ({ jwtToken, API_URL, userSeq }: UseChatProps) => {
  const [roomSeq, setRoomSeq] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  const testRequest = async () => {
    try {
      console.log("hihi");
      const response = await axios.get(
        "https://k11e106.p.ssafy.io/api/chats/webflux/artistInfo/1",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          timeout: 100000,
        }
      );
      console.log("테스트 요청 성공:", response.data);
      if (!response.data) {
        console.log("응답 데이터 없음");
      }
    } catch (error) {
      console.log("상고나없나");
      console.error("테스트 요청 실패:", error);
    }
  };

  useEffect(() => {
    testRequest();
  }, []);

  const handleCreateChat = async (OtheruserSeq: number) => {
    if (!jwtToken || !userSeq) return;

    const data = {
      receiversSeq: [OtheruserSeq],
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

  const handleFetchMessages = async () => {
    if (!jwtToken || !userSeq || !roomSeq) return;

    try {
      const response = await axios.get(
        `${API_URL}/api/chats/webflux/${roomSeq}/${userSeq}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setChatMessages(response.data);
    } catch (error) {
      console.error("메시지 가져오기 실패:", error);
    }
  };

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
      handleFetchMessages();
      setInputMessage("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  // const handleUserInfo = async () => {
  //   console.log("handleUserInfo 함수 호출됨");

  //   try {
  //     console.log("handleUserInfo 함수 호출됨2");
  //     console.log(API_URL);
  //     console.log(roomSeq);
  //     console.log(jwtToken);
  //     const response = await axios.get(
  //       `${API_URL}/api/chats/webflux/artistInfo/${roomSeq}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${jwtToken}`,
  //         },
  //       }
  //     );
  //     console.log("hihi");
  //     console.log("유저 정보:", response);
  //   } catch (error) {
  //     console.log("hihihihi");
  //     console.error("유저 정보 조회 실패:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (isChatModalOpen && roomSeq) {
  //     handleUserInfo();
  //   }
  // }, [isChatModalOpen, roomSeq]);

  return {
    roomSeq,
    chatMessages,
    isChatModalOpen,
    inputMessage,
    setInputMessage,
    setIsChatModalOpen,
    handleCreateChat,
    handleSendMessage,
    testRequest,
  };
};
