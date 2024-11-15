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
  const eventSourceRef = useRef<EventSource | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  const API_URL = import.meta.env.VITE_API_URL;
  const authStorage = localStorage.getItem("auth-storage");
  const userSeq = authStorage
    ? JSON.parse(authStorage)?.state?.artistSeq
    : null;

  const jwtToken = localStorage.getItem("jwtToken");
  const chatList = useChatList(API_URL, userSeq, jwtToken, modalOpen);
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

  // 채팅방 누구 있는지 ?
  const handleFetchChatRoomUsers = (roomSeq: number) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `${API_URL}/api/chats/webflux/artistInfo/${roomSeq}?token=${jwtToken}`
    );

    eventSource.onmessage = (event) => {
      const user: ChatRoomUser = JSON.parse(event.data);
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
      console.error(error);
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
      console.error(error);
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
        console.log("채팅방 나가기 성공:");
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

  const formatMessageTimeList = (createdAt: string) => {
    const messageDate = new Date(createdAt);
    const now = new Date();

    const isToday =
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear();

    const isYesterday =
      messageDate.getDate() === now.getDate() - 1 &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear();

    if (isToday) {
      // 오늘인 경우 시간만 표시
      const hours = messageDate.getHours();
      const minutes = messageDate.getMinutes().toString().padStart(2, "0");
      const period = hours < 12 ? "오전" : "오후";
      const formattedHours = hours % 12 || 12;
      return `${period} ${formattedHours}:${minutes}`;
    } else if (isYesterday) {
      // 어제인 경우 "어제"로 표시
      return "어제";
    } else {
      // 그 외 날짜는 월/일로 표시
      const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
      const day = messageDate.getDate().toString().padStart(2, "0");
      return `${month}/${day}`;
    }
  };

  // 채팅 목록 정렬
  const sortedChatList = [...chatList].sort((a, b) => {
    const dateA = new Date(a.lastMsgTime).getTime();
    const dateB = new Date(b.lastMsgTime).getTime();
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

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
                    padding="10px"
                  >
                    <Box
                      width="60px"
                      height="60px"
                      borderRadius="full"
                      overflow="hidden"
                      marginRight="10px"
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
                backgroundColor="gray.100"
                borderRadius="15px"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }}
              >
                {chatMessages.map((message, index) => {
                  const isUserMessage =
                    String(message.artistSeq) === String(userSeq);

                  return (
                    <Flex
                      key={index}
                      direction="column"
                      alignSelf={isUserMessage ? "flex-end" : "flex-start"}
                      maxWidth="70%"
                      marginBottom="5px"
                      padding="8px 12px"
                      borderRadius="15px"
                      position="relative"
                      fontFamily="MiceGothic"
                      bg={isUserMessage ? "blue.500" : "gray.200"}
                      color={isUserMessage ? "white" : "black"}
                      boxShadow="md"
                      borderBottomLeftRadius={isUserMessage ? "20px" : "0"}
                      borderBottomRightRadius={isUserMessage ? "0" : "20px"}
                      marginRight={isUserMessage ? "10px" : 0}
                      marginLeft={isUserMessage ? 0 : "10px"}
                      textAlign={isUserMessage ? "right" : "left"}
                    >
                      <Text fontSize="16px" wordBreak="break-word">
                        {message.msg}
                      </Text>
                      <Text
                        fontSize="12px"
                        color={isUserMessage ? "gray.100" : "gray.500"}
                        textAlign={isUserMessage ? "right" : "left"}
                        marginTop="5px"
                      >
                        {formatMessageTime(message.createdAt)}
                      </Text>
                    </Flex>
                  );
                })}
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
                  <Text fontFamily="MiceGothicBold">전송</Text>
                </Button>
              </Flex>
              <Button
                colorScheme="red"
                position="absolute"
                right="30px"
                fontFamily="MiceGothicBold"
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
              position="sticky"
              top="0"
              zIndex="1"
            >
              <Flex justify="space-between" align="center">
                <Text fontSize="24px" fontWeight="bold" color="black">
                  채팅
                </Text>

                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "latest" | "oldest")
                  }
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "16px",
                  }}
                >
                  <option value="latest">최신순</option>
                  <option value="oldest">오래된순</option>
                </select>
              </Flex>
            </Box>

            <Box
              padding="20px"
              height="500px"
              overflowY="auto"
              backgroundColor="gray.100"
              borderRadius="15px"
              css={{
                "&::-webkit-scrollbar": {
                  width: "10px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#555",
                },
              }}
            >
              {chatList && chatList.length > 0 ? (
                sortedChatList.map((item: ChatListResponse) => (
                  <Box
                    key={item.roomSeq}
                    padding={4}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    mb={4}
                    cursor="pointer"
                    _hover={{ background: "white", borderRadius: "15px" }}
                    onClick={() => handleChatRoomClick(item.roomSeq)}
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Flex align="center">
                        {item.chatRoomResponses.map((user, index) => (
                          <Box
                            key={index}
                            width="60px"
                            height="60px"
                            borderRadius="full"
                            overflow="hidden"
                            marginRight="10px"
                            border="2px solid white"
                          >
                            <img
                              src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${user.artistImage}`}
                              alt={`${user.nickname}의 프로필 이미지`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        ))}
                        <Box>
                          <Text
                            fontFamily="MiceGothicBold"
                            fontSize="18px"
                            textAlign="left"
                          >
                            {item.chatRoomResponses
                              .map((user) => user.nickname)
                              .join(", ")}
                          </Text>
                          <Text color="gray.700" textAlign="left">
                            {item.lastMsg.length > 20
                              ? `${item.lastMsg.slice(0, 20)}...`
                              : item.lastMsg}
                          </Text>
                        </Box>
                      </Flex>
                      <Text
                        fontSize="14px"
                        color="gray.500"
                        marginBottom="25px"
                      >
                        {formatMessageTimeList(item.lastMsgTime)}
                      </Text>
                    </Flex>
                  </Box>
                ))
              ) : (
                <Text fontFamily="MiceGothicBold">채팅방이 없습니다.</Text>
              )}
            </Box>
          </Box>
        )}
      </Modal>
    </>
  );
};

export default ChatList;
