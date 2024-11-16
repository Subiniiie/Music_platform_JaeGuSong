import React, { useState, useRef, useEffect } from "react";
import { Box, Input, VStack, Flex, Text } from "@chakra-ui/react";
import axios from "axios";

interface User {
  artistSeq: string;
  nickname: string;
  profilePicUrl: string;
}

interface ChatSearchProps {
  onUserSelect: (user: User) => void;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const jwtToken = localStorage.getItem("jwtToken");

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsDropdownVisible(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/artists/${query}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setSearchResults(
        Array.isArray(response.data) ? response.data : [response.data]
      );
      setIsDropdownVisible(true);
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSearchResults(query);
    }, 300);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <Box
      backgroundColor="white"
      position="relative"
      zIndex="100"
      ref={searchRef}
    >
      <Flex alignItems="center" width="350px" marginLeft="20px">
        <Input
          placeholder="유저 검색"
          value={searchQuery}
          onChange={handleInputChange}
          flex="1"
        />
      </Flex>

      {isDropdownVisible && searchResults.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          width="100%"
          backgroundColor="white"
          boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
          borderRadius="8px"
          overflow="hidden"
          maxHeight="300px"
          overflowY="auto"
          zIndex="200"
        >
          <VStack align="stretch">
            {searchResults.map((user) => (
              <Flex
                key={user.artistSeq || user.nickname}
                padding="10px"
                alignItems="center"
                borderBottom="1px solid #eee"
                cursor="pointer"
                _hover={{ backgroundColor: "gray.100" }}
                onClick={() => {
                  onUserSelect(user);
                  setIsDropdownVisible(false);
                }}
              >
                <Box
                  width="50px"
                  height="50px"
                  borderRadius="full"
                  overflow="hidden"
                  marginRight="10px"
                >
                  <img
                    src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${user.profileImage}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt={`${user.nickname} 프로필`}
                  />
                </Box>
                <Text fontSize="16px" fontWeight="bold">
                  {user.nickname}
                </Text>
              </Flex>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default ChatSearch;
