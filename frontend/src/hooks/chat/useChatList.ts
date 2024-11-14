import { useState, useEffect, useRef } from "react";

const useChatList = (
  API_URL: string,
  userSeq: string | null,
  jwtToken: string | null
) => {
  const [chatList, setChatList] = useState<any[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!userSeq) return;

    const eventSource = new EventSource(
      `${API_URL}/api/chats/webflux/${userSeq}?token=${jwtToken}`
    );

    eventSource.onmessage = (event) => {
      const users = JSON.parse(event.data);

      setChatList((prevList) => {
        if (prevList.some((chat) => chat.roomSeq === users.roomSeq)) {
          return prevList;
        }
        return [...prevList, users];
      });
    };

    eventSource.onerror = (error) => {
      console.error("SSE 에러:", error);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [API_URL, userSeq, jwtToken]);

  return chatList;
};

export default useChatList;
