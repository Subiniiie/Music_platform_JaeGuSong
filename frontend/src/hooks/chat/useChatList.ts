import { useState, useEffect, useRef } from "react";

const useChatList = (
  API_URL: string,
  userSeq: string | null,
  jwtToken: string | null,
  resetKey: boolean
) => {
  const [chatList, setChatList] = useState<any[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!userSeq || !jwtToken) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    const eventSource = new EventSource(
      `${API_URL}/api/chats/webflux/${userSeq}?token=${jwtToken}`
    );

    eventSource.onmessage = (event) => {
      const newChat = JSON.parse(event.data);
      setChatList((prevList) => {
        if (prevList.some((chat) => chat.roomSeq === newChat.roomSeq)) {
          return prevList.map((chat) =>
            chat.roomSeq === newChat.roomSeq ? { ...chat, ...newChat } : chat
          );
        }
        return [...prevList, newChat];
      });
    };

    eventSource.onerror = (error) => {
      console.error(error);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [API_URL, userSeq, jwtToken, resetKey]);

  return chatList;
};

export default useChatList;
