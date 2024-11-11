import React, { useEffect, useState } from "react";
import useMyInfo from "@/hooks/setting/useMyInfo";
import { UserInfo } from "@/hooks/setting/useMyInfo";
import { Input, Box, Button } from "@chakra-ui/react";

const regions = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "제주",
  "경기도 남부",
  "경기도 북부",
  "강원도 남부",
  "강원도 북부",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
];
const genders = ["남성", "여성", "기타"];
const positions = [
  "보컬",
  "베이스",
  "드럼",
  "일렉트릭기타",
  "어쿠스틱기타",
  "건반",
  "관악기",
  "현악기",
  "키보드",
];
const genres = [
  "락",
  "발라드",
  "인디",
  "댄스",
  "클래식",
  "재즈",
  "오케스트라",
  "랩",
  "기타",
];



const MyInfo: React.FC<{ myInfo: UserInfo }> = ({ myInfo }) => {
  const { createOrUpdateMyInfo } = useMyInfo();
  const [modifiedInfo, setModifiedInfo] = useState<UserInfo>({
    ...myInfo,
    nickname: myInfo.nickname || "",
    name: myInfo.name || "",
    email: myInfo.email || "",
    region: myInfo.region || "",
    gender: myInfo.gender || "",
    position: myInfo.position || "",
    genre: myInfo.genre || "",
    birth: myInfo.birth || "",
  });

  useEffect(() => {
    setModifiedInfo({
      ...myInfo,
      nickname: myInfo.nickname || "",
      name: myInfo.name || "",
      email: myInfo.email || "",
      region: myInfo.region || "",
      gender: myInfo.gender || "",
      position: myInfo.position || "",
      genre: myInfo.genre || "",
      birth: myInfo.birth || "",
    }); // 초기 값 설정
  }, [myInfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file" && e.target instanceof HTMLInputElement) {
      const files = e.target.files;
      if (files && files.length > 0) {
        setModifiedInfo((prev) => ({
          ...prev,
          profileImage: files[0], // 파일 필드 업데이트
        }));
      }
    } else {
      setModifiedInfo((prev) => ({
        ...prev,
        [name]: value, // 일반 필드 업데이트
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createOrUpdateMyInfo(modifiedInfo); // 변경된 값 포함한 전체 정보 전송
  };

  return (
    <Box>
      {modifiedInfo ? (
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="row" gap="20px" marginTop="10px">
            <Box>
              <label>별명</label>
              <Input
                type="text"
                name="nickname"
                placeholder={modifiedInfo.nickname}
                onChange={handleChange}
                color="white"
                width="300px"
                marginLeft="10px"
                border="1px solid"
                borderRadius="5px"
                borderColor="white"
              />
            </Box>
            <Box>
              <label>이름</label>
              <Input
                type="text"
                name="name"
                value={modifiedInfo.name}
                onChange={handleChange}
                color="white"
                width="300px"
                disabled
                marginLeft="10px"
              />
            </Box>
          </Box>

          <Box marginTop="20px">
            <label>아이디</label>
            <Input
              type="email"
              name="email"
              value={modifiedInfo.email}
              onChange={handleChange}
              color="white"
              width="300px"
              marginLeft="10px"
              disabled
            />
          </Box>

          <Box display="flex" flexDirection="row" gap="20px" marginTop="20px">
            <Box>
              <label>지역</label>
              <select
                name="region"
                value={modifiedInfo.region}
                onChange={handleChange}
                style={{
                  color: "gray",
                  background: "#02001F",
                  border: "1px solid",
                  borderRadius: "5px",
                  borderColor: "white",
                  padding: "0.5rem",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
              >
                <option>전라남도</option>
                {regions.map((region, index) => {
                  if (region !== myInfo.region) {
                    return (
                      <option key={index} value={region}>
                        {region}
                      </option>
                    );
                  }
                })}
              </select>
            </Box>
            <Box>
              <label>성별</label>
              <select
                name="gender"
                value={modifiedInfo.gender}
                onChange={handleChange}
                style={{
                  color: "gray",
                  background: "#02001F",
                  border: "1px solid",
                  borderRadius: "5px",
                  borderColor: "white",
                  padding: "0.5rem",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
              >
                <option>남성</option>
                {genders.map((gender, index) => {
                  if (gender !== myInfo.region) {
                    return (
                      <option key={index} value={gender}>
                        {gender}
                      </option>
                    );
                  }
                })}
              </select>
            </Box>
          </Box>

          <Box display="flex" flexDirection="row" gap="20px" marginTop="20px">
            <Box>
              <label>포지션</label>
              <select
                name="position"
                value={modifiedInfo.position}
                onChange={handleChange}
                style={{
                  color: "gray",
                  background: "#02001F",
                  border: "1px solid",
                  borderRadius: "5px",
                  borderColor: "white",
                  padding: "0.5rem",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
              >
                <option>건반</option>
                {positions.map((position, index) => {
                  if (position !== myInfo.region) {
                    return (
                      <option key={index} value={position}>
                        {position}
                      </option>
                    );
                  }
                })}
              </select>
            </Box>
            <Box>
              <label>장르</label>
              <select
                name="genre"
                value={modifiedInfo.genre}
                onChange={handleChange}
                style={{
                  color: "gray",
                  background: "#02001F",
                  border: "1px solid",
                  borderRadius: "5px",
                  borderColor: "white",
                  padding: "0.5rem",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
              >
                <option>건반</option>
                {genres.map((genre, index) => {
                  if (genre !== myInfo.region) {
                    return (
                      <option key={index} value={genre}>
                        {genre}
                      </option>
                    );
                  }
                })}
              </select>
            </Box>
          </Box>

          <Box marginTop="20px">
            <label>생일</label>
            <Input
              type="date"
              name="birth"
              onChange={handleChange}
              background="#02001F"
              color="gray"
              width="300px"
              marginLeft="10px"
              cursor="pointer"
            />
          </Box>

          <Box marginTop="20px">
            <label>프로필 이미지</label>
            <Input
              type="file"
              name="profileImage"
              marginLeft="10px"
              paddingTop="7px"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) {
                  // setFormData(prevData => ({ ...prevData, profileImage: file }));
                  // setChangedFields(prev => ({ ...prev, profileImage: true }));
                }
              }}
              background="#02001F"
              color="gray"
              width="300px"
              cursor="pointer"
            />
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              _hover={{ backgroundColor: "gray", color: "black" }}
            >
              수정
            </Button>
          </Box>
        </form>
      ) : null}
    </Box>
  );
};

export default MyInfo;
