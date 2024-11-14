import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import Modal from "@/components/common/Modal";
import useChatList from "@/hooks/chat/useChatList";

interface ChatListResponse {
  roomSeq: number;
  chatRoomResponses: { nickname: string }[];
  lastMsg: string;
  lastMsgTime: string;
}

const ChatList = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const authStorage = localStorage.getItem("auth-storage");
  const userSeq = authStorage
    ? JSON.parse(authStorage)?.state?.artistSeq
    : null;

  const jwtToken = localStorage.getItem("jwtToken");

  const chatList = useChatList(API_URL, userSeq, jwtToken);
  const handleChatButtonClick = () => {
    setModalOpen(!modalOpen);
  };

  const handleChatRoomClick = (roomSeq: number) => {
    console.log("채팅방 클릭:", roomSeq);
  };

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
      <Modal isOpen={modalOpen} onClose={handleChatButtonClick}>
        <Box padding="20px" width="400px" height="600px" overflowY="auto">
          <Text fontSize="24px" fontWeight="bold" color="black" mb={4}>
            채팅방 목록
          </Text>

          {chatList && chatList.length > 0 ? (
            chatList.map((item: ChatListResponse) => (
              <Box
                key={item.roomSeq}
                padding={3}
                borderBottom="1px"
                borderColor="gray.200"
                mb={2}
                cursor="pointer"
                onClick={() => handleChatRoomClick(item.roomSeq)} // 채팅방 클릭 시 실행
              >
                <Text fontWeight="bold">
                  {item.chatRoomResponses
                    .map((user) => user.nickname)
                    .join(", ")}
                </Text>
                <Text>{item.lastMsg}</Text>
                <Text color="gray.500" fontSize="sm">
                  {item.lastMsgTime}
                </Text>
              </Box>
            ))
          ) : (
            <Text>No chat rooms available</Text> // 채팅방이 없을 때 표시
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ChatList;
