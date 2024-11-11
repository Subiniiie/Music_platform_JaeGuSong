import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Text, Button, Input as ChakraInput, Textarea, Card, Image, Flex } from "@chakra-ui/react";
import Modal from "@/components/common/Modal";
import CommunityButton from "@/components/community/community-button";
import UseCommunityCrew from "@/hooks/community/useCommunityCrew";
import useMyCrew from "@/hooks/setting/useMyCrew";
import { UserInfo } from "@/hooks/setting/useMyInfo";
import { MakeCrewInputFields } from "@/configs/community/makeCrew";
import MyInfo from "@/components/setting/myInfo";
import paths from "@/configs/paths";
import { useNavigate } from "react-router-dom";
import useHeaderStore from "@/stores/headerStore";

type Crew = {
  crewSeq: number;
  profileImage: string;
  nickname: string;
};

const MyPageView: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [crewsInfo, setCrewsInfo] = useState([]);
  const [myInfo, setMyInfo] = useState<UserInfo | null>(null);
  const { setOpenUserHeader } = useHeaderStore(state => state);
  const {
    openMakeCrewModal,
    makeCrewFormData,
    handleMakeCrewModal,
    handleChange,
    makeCrew,
    setMakeCrewFormData,
  } = UseCommunityCrew();

  const { crewData, getMyCrews } = useMyCrew();
  const navigate = useNavigate();
  const formData = new FormData();

  // 파일 선택을 위한 상태 추가
  const [file, setFile] = useState<File | null>(null);

  // 파일 선택 시 호출되는 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      setMakeCrewFormData({
        ...makeCrewFormData,
        profileImage: selectedFile,
      });
    }
  };

  // 크루 생성 함수 수정
  const handleMakeCrew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 파일이 선택된 경우 FormData에 추가
    if (file) {
      formData.append("profileImage", file);
    }

    makeCrew(makeCrewFormData); // makeCrew 함수에 FormData 전달
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedToken = localStorage.getItem("jwtToken");
      if (storedToken) {
        try {
          const response = await axios.get(`${API_URL}/api/user`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          setMyInfo(response.data);
          setCrewsInfo(response.data.crews);
        } catch (error) {
          console.warn("Error during API request:", error);
        }
      } else {
        console.warn("No stored token found");
      }
    };
    fetchUserInfo(); // 유저 정보 가져오기
  }, []); // 의존성 추가

  useEffect(() => {
    if (crewsInfo) {
      getMyCrews(crewsInfo);
    }
  }, [crewsInfo, getMyCrews]);

  const goCrewFeed = ({ crew }: { crew: Crew }) => {
    setOpenUserHeader(false)
    navigate(paths.community.generalCommunity(crew.crewSeq))
  }

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding="20px"
    >
      <Box width="100%" maxWidth="800px" color="white">
        <Box display="flex" flexDirection="row" gap="10px" marginBottom="20px">
          <Text fontSize="xl" fontWeight="bold">
            내 크루
          </Text>
          <CommunityButton title="크루 만들기" onClick={handleMakeCrewModal} />
        </Box>
        {crewsInfo && crewsInfo.length > 0 ? (
          <Flex flexDirection="row" flexWrap="wrap" gap="20px">
            {crewData.map((crew) => (
              <Card.Root
                key={crew.crewSeq}
                width="180px"
                overflow="hidden"
                background="#2d3748"
                borderRadius="md"
                boxShadow="lg"
                onClick={() => goCrewFeed({crew})}
                cursor="pointer"
              >
                <Image
                  src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${crew.profileImage}`}
                  alt={crew.profileImage}
                  objectFit="cover"
                  height="120px"
                  width="100%"
                />
                <Card.Body
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  padding="10px"
                >
                  <Card.Title color="white" fontSize="md" fontWeight="bold">
                    {crew.nickname}
                  </Card.Title>
                </Card.Body>
              </Card.Root>
            ))}
          </Flex>
        ) : (
          <Text color="white" textAlign="center">
            가입한 크루가 없습니다.
          </Text>
        )}
        <Text fontSize="xl" fontWeight="bold" marginTop="50px">
          내 정보
        </Text>
        {openMakeCrewModal && (
          <Modal isOpen={openMakeCrewModal} onClose={handleMakeCrewModal}>
            <Box
              width="500px"
              height="550px"
              marginTop="60px"
              padding="20px"
              borderRadius="md"
              bg="white"
              color="black"
            >
              <Text fontSize="2xl" fontWeight="bold" color="black">
                크루 생성
              </Text>
              <Box marginTop="50px">
                <form onSubmit={handleMakeCrew}>
                  <Box display="flex" alignItems="center" mb="4">
                    <Text as="label" fontWeight="medium" width="150px">
                      크루명
                    </Text>
                    <ChakraInput
                      type="text"
                      name="nickname"
                      value={makeCrewFormData.nickname}
                      onChange={handleChange}
                      placeholder="크루 이름을 입력하세요"
                    />
                  </Box>
                  <Box display="flex" alignItems="center" mb="4">
                    <Text as="label" fontWeight="medium" width="150px">
                      (선택)크루 설명
                    </Text>
                    <Textarea
                      name="content"
                      value={makeCrewFormData.content}
                      onChange={handleChange}
                      placeholder="크루 설명을 입력하세요"
                      height="200px"
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box display="flex" alignItems="center" mb="4">
                      <Text as="label" fontWeight="medium" width="100px">
                        지역
                      </Text>
                      <select
                        name="region"
                        onChange={handleChange}
                        value={makeCrewFormData.region}
                      >
                        <option>선택</option>
                        {MakeCrewInputFields[2].options?.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Box>
                    <Box display="flex" alignItems="center" mb="4">
                      <Text as="label" fontWeight="medium" width="100px">
                        장르
                      </Text>
                      <select
                        name="genre"
                        onChange={handleChange}
                        value={makeCrewFormData.genre}
                      >
                        <option>선택</option>
                        {MakeCrewInputFields[3].options?.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mb="4">
                    <Text as="label" fontWeight="medium" width="150px">
                      프로필 이미지
                    </Text>
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleFileChange}
                      style={{ color: "black" }}
                    />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignContent="center"
                    gap="10px"
                    marginTop="50px"
                  >
                    <Button type="submit">생성</Button>
                    <Button onClick={handleMakeCrewModal}>취소</Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </Modal>
        )}
        <MyInfo myInfo={myInfo ? myInfo : {}} />
      </Box>
    </Flex>
  );
};

export default MyPageView;