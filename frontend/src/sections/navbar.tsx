import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Link,
  Stack,
  Text,
  Collapsible
} from "@chakra-ui/react";
import paths from "@/configs/paths";
import useAuth from "@/hooks/auth/useAuth";
import useSearch from "@/hooks/search/useSearch";
import { useEffect, useState } from "react";
import useAuthStore from "@/stores/authStore";

export default function Navbar() {
  const { goSignupPage, goSignInPage, goLogout } = useAuth();
  const {
    isSearchActive,
    isVisible,
    searchQuery,
    searchResults,
    runSearch,
    toggleSearch,
    handleSearchChange,
    handleSearchSubmit,
    goOtherFeed,
  } = useSearch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const artistNickname = useAuthStore((state) => state.artistNickname);


  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    console.log("runSearch 상태:", runSearch);
    console.log("searchResults 상태:", searchResults);
  }, [runSearch, searchResults]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("fcmToken");
    localStorage.removeItem("auth-storage");
    setIsLoggedIn(false);
    goLogout();
  };

  const items = [
    {
      value: "a",
      title: "커뮤니티",
      text: [
        {label: "메인", path: paths.community.main},
        {label: "내 피드", path: paths.community.myCommunity},
      ]
    },
    {
      value: "b",
      title: "검색",
      onclick: (event) => {
        event.preventDefault();
        toggleSearch();
      },
    },
    {
      value: "c",
      title: "디바이더",
      text: [
        { label: "음원 업로드", path: paths.divider.upload },
        { label: "워크스페이스", path: paths.workspace.list },
      ],
    },
    {
      value: "d",
      title: "미니 게임",
      path: paths.game.home,
    },
    {
      value: "e",
      title: "마이페이지",
      path: paths.setting.mypage,
    },
  ];

  return (
    <Flex>
      <Box
        width={isSearchActive ? "300px" : "0px"}
        height="100vh"
        bg="#02001F"
        color="white"
        padding={isSearchActive ? "4" : "0"}
        position="fixed"
        top="0"
        left="250px"
        zIndex="1000"
        transition="width 0.5s ease-in-out, opacity 0.6s ease-in-out"
        opacity={isSearchActive ? 1 : 0}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          marginBottom="4"
        >
          <Text fontSize="xl" fontWeight="bold">
            검색
          </Text>
          <Button
            fontSize="18px"
            fontWeight="bold"
            color="white"
            bg="none"
            _hover={{ color: "#4e4b7e" }}
            onClick={toggleSearch}
          >
            X
          </Button>
        </Flex>
        <form onSubmit={handleSearchSubmit}>
          <Box 
            display="flex" 
            flexDirection="row"
            gap="5px"
          >
            <Input
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={handleSearchChange}
              marginBottom="4"
              borderColor="white"
              color="white"
            />
            <Button 
              type="submit"
              borderWidth="1px" 
              borderColor="#c5e4f3" 
              background="none"
            >
              검색
            </Button>
          </Box> 
        </form>
        {runSearch ? (
          searchResults.length > 0 && searchResults[0]?.length > 0 ? (
            searchResults[0].map((searchResult, index) => (
              <Text 
              key={index}
              cursor="pointer"
              onClick={() => goOtherFeed(searchResult.seq, searchResult.nickname, searchResult.profileImage)}
            >
              {searchResult.nickname}
            </Text>
            ))
          ) : (
            "검색 결과가 없습니다."
          )
        ) : ""}
      </Box>
      <Stack padding="0" fontFamily="MiceGothicBold" flex="1">
        <Box width="100%" margin="0" paddingY="4">
          <Link href={paths.community.main}>
            <Image src="/common/Logo.png" alt="Logo.png" />
          </Link>
        </Box>
        <Stack>
          <Flex gap="2">
            {isLoggedIn ? (
              <Box display="flex" flexDirection="column">
                                <Box display="flex" justifyContent="center" marginRight="10px" marginTop="10px" marginBottom="20px">
                  <Text color="white">{artistNickname}님 환영합니다</Text>
                </Box>
              
              <Box
                display="flex"
                flexDirection="row"
                gap="10px"
                justifyContent="center"
              >
                
                <Collapsible.Root>
                  <Collapsible.Trigger asChild>
                    <Button
                      border="solid 2px #9000FF"
                      borderRadius="15px"
                      height="30px"
                      width="60px"
                      _hover={{
                        color: "#9000ff",
                        border: "solid 2px white",
                      }}
                    >
                    팔로워
                    </Button>
                  </Collapsible.Trigger>
                  <Collapsible.Content
                    style={{
                      position: "absolute", 
                      top: "225px",
                      width: "230px", 
                      maxWidth: "230px",
                      background: "white"
                    }}
                  >
                    <Box padding="4" borderWidth="1px" color="black">
                      팔로워 목록
                    </Box>
                  </Collapsible.Content>
                </Collapsible.Root>
                <Collapsible.Root>
                <Collapsible.Trigger asChild>
                <Button
                  border="solid 2px #9000FF"
                  borderRadius="15px"
                  height="30px"
                  width="60px"
                  _hover={{
                    color: "#9000ff",
                    border: "solid 2px white",
                  }}
                >
                  팔로잉
                </Button>
                </Collapsible.Trigger>
                  <Collapsible.Content
                    style={{
                      position: "absolute", 
                      top: "225px",
                      left: "16px",
                      width: "230px", 
                      maxWidth: "230px",
                      background: "white",
                      zIndex: 10,
                    }}
                  >
                    <Box padding="4" borderWidth="1px" color="black">
                      팔로잉 목록
                    </Box>
                  </Collapsible.Content>
                </Collapsible.Root>
                <Button
                  border="solid 2px #9000FF"
                  borderRadius="15px"
                  height="30px"
                  width="80px"
                  onClick={handleLogout}
                  _hover={{
                    color: "#9000ff",
                    border: "solid 2px white",
                  }}
                >
                  로그아웃
                </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Button
                  border="solid 2px #9000FF"
                  borderRadius="15px"
                  height="30px"
                  width="80px"
                  _hover={{
                    color: "#9000ff",
                    border: "solid 2px white",
                  }}
                  onClick={goSignInPage}
                >
                  로그인
                </Button>
                <Button
                  border="solid 2px #9000FF"
                  borderRadius="15px"
                  height="30px"
                  width="80px"
                  _hover={{
                    color: "#9000ff",
                    border: "solid 2px white",
                  }}
                  onClick={goSignupPage}
                >
                  회원가입
                </Button>
              </>
            )}
          </Flex>

        </Stack>
        <Stack marginTop="10px">
          {items.map((item, index) => (
            <Box key={index} paddingY="1" marginTop="5px">
              <Text
                fontSize="lg"
                cursor="pointer"
                color="white"
                _hover={{
                  color: "#9000ff",
                }}
                onClick={(event) => {
                  if (item.onclick) {
                    item.onclick(event);
                  } else if (item.path) {
                    window.location.href = item.path;
                  }
                }}
              >
                {item.title}
              </Text>
              {(item.value === "a" || item.value === "c") &&
                item.text?.map((linkItem, i) => (
                  <Link
                    key={i}
                    href={linkItem.path}
                    color="white"
                    display="block"
                    paddingY="1"
                    paddingLeft="20px"
                    cursor="pointer"
                    _hover={{
                      color: "#9000ff",
                    }}
                  >
                    <Text fontSize="sm">{linkItem.label}</Text>
                  </Link>
                ))}
            </Box>
          ))}
        </Stack>
      </Stack>
    </Flex>
  );
}
