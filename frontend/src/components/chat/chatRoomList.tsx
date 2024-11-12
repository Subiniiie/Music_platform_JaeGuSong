import React from "react";
import { VStack, Button } from "@chakra-ui/react";
import { User } from "../../hooks/chat/useChat";

interface ChatRoomListProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ users, onSelectUser }) => {
  return (
    <VStack
      spacing={4}
      p={4}
      maxH="calc(100% - 60px)"
      overflowY="auto"
      bg="white"
    >
      {users.map((user) => (
        <Button
          key={user.id}
          onClick={() => onSelectUser(user)}
          width="100%"
          bg="blue.50"
          _hover={{ bg: "blue.100" }}
        >
          {user.userName}
        </Button>
      ))}
    </VStack>
  );
};

export default ChatRoomList;
