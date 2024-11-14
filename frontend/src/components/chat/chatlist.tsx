import { useState } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
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
        <Box padding="0" width="600px" height="600px" overflowY="auto">
          <Box
            padding="20px"
            backgroundColor="white"
            borderBottom="1px solid"
            borderColor="gray.200"
            position="sticky"
            top="0"
            zIndex="1"
          >
            <Text fontSize="24px" fontWeight="bold" color="black">
              채팅
            </Text>
          </Box>

          <Box padding="20px">
            {chatList && chatList.length > 0 ? (
              chatList.map((item: ChatListResponse) => (
                <Box
                  key={item.roomSeq}
                  padding={4}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  mb={4}
                  cursor="pointer"
                  _hover={{ background: "gray.100" }}
                  onClick={() => handleChatRoomClick(item.roomSeq)}
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="bold" fontSize="18px">
                      {item.chatRoomResponses
                        .map((user) => user.nickname)
                        .join(", ")}
                    </Text>
                    <Text fontSize="14px" color="gray.500">
                      {new Date(item.lastMsgTime).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Flex>
                  <Text color="gray.700" textAlign="left">
                    {item.lastMsg}
                  </Text>
                </Box>
              ))
            ) : (
              <Text>채팅방이 없습니다.</Text>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ChatList;
