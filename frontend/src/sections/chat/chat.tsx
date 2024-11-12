import React from "react";
import { Flex } from "@chakra-ui/react";
import Modal from "@/components/common/Modal";
import ChatRoomList from "../../components/chat/chatRoomList";
import ChatRoom from "../../components/chat/chatRoom";
import useChat from "../../hooks/chat/useChat";

const Chat = () => {
  const {
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
  } = useChat(import.meta.env.VITE_API_URL);

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
          <Flex direction="column" width="600px" height="600px">
            {!selectedChatUser ? (
              <ChatRoomList
                users={mockUsers}
                onSelectUser={setSelectedChatUser}
              />
            ) : (
              <ChatRoom
                selectedChatUser={selectedChatUser}
                messages={messages}
                message={message}
                setMessage={setMessage}
                onSendMessage={sendMessage}
                onBack={() => setSelectedChatUser(null)}
                messagesEndRef={messagesEndRef}
              />
            )}
          </Flex>
        </Modal>
      )}
    </>
  );
};

export default Chat;
