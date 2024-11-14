import { useState, useEffect, useRef } from "react";
import { Box, Text, Flex, Button, Input, VStack } from "@chakra-ui/react";
import Modal from "@/components/common/Modal";
import useChatList from "@/hooks/chat/useChatList";
import axios from "axios";

interface ChatListResponse {
  roomSeq: number;
  chatRoomResponses: { nickname: string }[];
  lastMsg: string;
  lastMsgTime: string;
}

interface ChatMessage {
  artistSeq: number;
  roomSeq: number;
  msg: string;
  createdAt: string;
}

interface ChatRoomUser {
  artistSeq: string;
  nickname: string;
  profilePicUrl: string;
}

const ChatList = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<ChatListResponse | null>(
    null
  );
  const [inputMessage, setInputMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatRoomUsers, setChatRoomUsers] = useState<ChatRoomUser[]>([]);
  console.log(chatRoomUsers);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const authStorage = localStorage.getItem("auth-storage");
  const userSeq = authStorage
    ? JSON.parse(authStorage)?.state?.artistSeq
    : null;

  const jwtToken = localStorage.getItem("jwtToken");
  const chatList = useChatList(API_URL, userSeq, jwtToken);

  const handleChatButtonClick = () => {
    setModalOpen(!modalOpen);
    setSelectedRoom(null);
    setChatMessages([]);
    setChatRoomUsers([]);
    eventSourceRef.current?.close();
  };

  const handleChatRoomClick = (roomSeq: number) => {
    const room = chatList.find((item) => item.roomSeq === roomSeq);
    if (room) {
      setSelectedRoom(room);
      handleFetchChatRoomUsers(roomSeq);
      handleFetchMessages(roomSeq);
    }
  };

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedRoom) return;

    const data: ChatMessage = {
      artistSeq: userSeq!,
      roomSeq: selectedRoom.roomSeq,
      msg: inputMessage,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(`${API_URL}/api/chats/webflux?token=${jwtToken}`, data);
      setInputMessage("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  // 채팅방 유저 누구있는지 ?
  const handleFetchChatRoomUsers = (roomSeq: number) => {
    const eventSource = new EventSource(
      `${API_URL}/api/chats/webflux/artistInfo/${roomSeq}?token=${jwtToken}`
    );

    eventSource.onmessage = (event) => {
      const user: ChatRoomUser = JSON.parse(event.data);
      console.log(user);
      if (user.artistSeq !== String(userSeq)) {
        setChatRoomUsers((prevUsers) => {
          if (
            prevUsers.some(
              (existingUser) => existingUser.artistSeq === user.artistSeq
            )
          ) {
            return prevUsers;
          }
          return [...prevUsers, user];
        });
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE 에러:", error);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;
  };

  // 채팅 메시지 가져오기 (EventSource)
  const handleFetchMessages = (roomSeq: number) => {
    const eventSource = new EventSource(
      `${API_URL}/api/chats/webflux/${roomSeq}/${userSeq}?token=${jwtToken}`
    );

    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE 에러:", error);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;
  };

  const handleLeaveChat = async () => {
    if (!selectedRoom) return;

    try {
      const response = await axios.delete(
        `${API_URL}/api/chats/leave/${selectedRoom.roomSeq}/${userSeq}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("채팅방 나가기 성공:", response);
        setSelectedRoom(null);
        setChatMessages([]);
        setChatRoomUsers([]);
        eventSourceRef.current?.close();
      }
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
    }
  };

  const formatMessageTime = (createdAt: string) => {
    const messageDate = new Date(createdAt);
    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes().toString().padStart(2, "0");

    const period = hours < 12 ? "오전" : "오후";
    const formattedHours = hours % 12 || 12;

    return `${period} ${formattedHours}:${minutes}`;
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

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
        {selectedRoom ? (
          <>
            <Flex
              direction="column"
              width="600px"
              height="600px"
              position="relative"
            >
              {chatRoomUsers.length > 0 &&
                chatRoomUsers.map((user) => (
                  <Flex
                    key={user.artistSeq}
                    direction="row"
                    alignItems="center"
                    marginBottom="20px"
                    padding="10px"
                  >
                    <Box
                      width="50px"
                      height="50px"
                      borderRadius="full"
                      overflow="hidden"
                      marginRight="10px"
                      border="2px solid #9000FF"
                    >
                      <img
                        src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${user.profilePicUrl}`}
                        alt={`${user.nickname}의 프로필 이미지`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Text fontSize="20px" fontWeight="bold">
                      {user.nickname}
                    </Text>
                  </Flex>
                ))}

              <VStack
                align="flex-start"
                marginTop="4"
                flex="1"
                overflowY="auto"
                marginBottom="100px"
              >
                {chatMessages.map((message, index) => (
                  <Flex
                    key={index}
                    bg={
                      String(message.artistSeq) === String(userSeq)
                        ? "skyblue"
                        : "gray.100"
                    }
                    p="2"
                    borderRadius="20px"
                    alignSelf={
                      String(message.artistSeq) === String(userSeq)
                        ? "flex-end"
                        : "flex-start"
                    }
                    color={
                      String(message.artistSeq) === String(userSeq)
                        ? "white"
                        : "black"
                    }
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                  >
                    {String(message.artistSeq) === String(userSeq) ? (
                      <>
                        <Text
                          fontSize="12px"
                          color="gray.500"
                          marginRight="10px"
                        >
                          {formatMessageTime(message.createdAt)}
                        </Text>
                        <Text fontSize="16px" flex="1" fontWeight="bold">
                          {message.msg}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text fontSize="16px" flex="1" fontWeight="bold">
                          {message.msg}
                        </Text>
                        <Text
                          fontSize="12px"
                          color="gray.500"
                          marginLeft="10px"
                        >
                          {formatMessageTime(message.createdAt)}
                        </Text>
                      </>
                    )}
                  </Flex>
                ))}
                <div ref={messageEndRef} />
              </VStack>

              <Flex
                alignItems="center"
                position="absolute"
                bottom="0"
                left="0"
                width="100%"
                padding="10px"
                background="white"
              >
                <Input
                  placeholder="메시지를 입력하세요"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  marginRight="10px"
                  flex="1"
                  borderRadius="20px"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <Text fontWeight="bold">전송</Text>
                </Button>
              </Flex>
              <Button
                colorScheme="red"
                position="absolute"
                // top="10px"
                right="30px"
                onClick={() => setIsConfirmModalOpen(true)}
              >
                채팅방 나가기
              </Button>
            </Flex>
            <Modal
              isOpen={isConfirmModalOpen}
              onClose={() => setIsConfirmModalOpen(false)}
            >
              <Flex
                direction="column"
                align="center"
                justify="center"
                padding="20px"
                width="300px"
                height="250px"
              >
                <Text
                  fontSize="18px"
                  marginBottom="30px"
                  textAlign="center"
                  fontWeight="bold"
                >
                  채팅기록이 완전히 삭제 됩니다. 그래도 나가시겠습니까 ?
                </Text>
                <Flex
                  justify="space-between"
                  width="100%"
                  gap="0"
                  marginTop="20px"
                >
                  <Button
                    colorScheme="red"
                    width="40%"
                    fontWeight="bold"
                    onClick={() => {
                      handleLeaveChat();
                      setIsConfirmModalOpen(false);
                      setModalOpen(false);
                    }}
                  >
                    예
                  </Button>
                  <Button
                    width="40%"
                    fontWeight="bold"
                    onClick={() => setIsConfirmModalOpen(false)}
                  >
                    아니오
                  </Button>
                </Flex>
              </Flex>
            </Modal>
          </>
        ) : (
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
                        {new Date(item.lastMsgTime).toLocaleTimeString(
                          "ko-KR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
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
        )}
      </Modal>
    </>
  );
};

export default ChatList;
