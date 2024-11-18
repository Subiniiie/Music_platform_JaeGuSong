import React, { useState, useEffect, ChangeEvent } from "react";
import { Box, Button, Input as ChakraInput, Textarea } from "@chakra-ui/react";
import useCrewSeqStore from "@/stores/crewSeqStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import paths from "@/configs/paths";

const Input: React.FC = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const authStorage = localStorage.getItem("auth-storage");
  const getCrewSeq = useCrewSeqStore((state) => state.getCrewSeqStore);
  const setGetCrewSeq = useCrewSeqStore((state) => state.setGetCrewSeqStore);
  const [artistSeq, setArtistSeq] = useState<number | null>(null);

  useEffect(() => {
    if (getCrewSeq !== 0) {
      setArtistSeq(getCrewSeq);
    } else {
      const parsedData = JSON.parse(authStorage || "{}");
      setArtistSeq(parsedData?.state?.artistSeq || null);
    }
  }, [getCrewSeq, authStorage, setGetCrewSeq, artistSeq]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    sources: null as File | null,
    state: "",
  });
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value, files } = e.target as HTMLInputElement;

    if (type === "file" && files) {
      const selectedFile = files[0]; // 첫 번째 파일을 가져옵니다.
      setFormData((prevFormData) => ({
        ...prevFormData,
        sources: selectedFile, // 파일을 formData의 sources 상태에 저장
      }));
    } else if (name === "visibility") {
      // select에 대해서 특별히 처리
      setFormData((prevFormData) => ({
        ...prevFormData,
        state: value, // select의 값은 state 반영
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value, // 텍스트 값 처리
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("jwtToken");

    // FormData 객체 생성
    const formDataToSubmit = new FormData();

    // boardRequestDto 생성
    const boardRequestDto = {
      artistSeq: artistSeq,
      title: formData.title,
      state: formData.state,
      content: formData.content,
    };

    // boardRequestDto를 FormData에 추가
    formDataToSubmit.append(
      "boardRequestDto",
      new Blob([JSON.stringify(boardRequestDto)], { type: "application/json" })
    );

    // 파일이 있는 경우에만 FormData에 추가
    if (formData.sources) {
      formDataToSubmit.append("files", formData.sources); // 파일 추가
    } else {
      console.warn("No file selected");
    }

    try {
      // FormData 내용 확인 (디버깅용)
      formDataToSubmit.forEach((value, key) => {
        console.log(key, value);
      });

      // 서버 요청
      const response = await axios.post(
        `${API_URL}/api/boards`,
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 성공 시 페이지 이동
      if (getCrewSeq !== 0) {
        navigate(paths.community.generalCommunity(getCrewSeq));
      } else {
        navigate(paths.community.myCommunity);
      }

      // 상태 초기화
      setGetCrewSeq(0);
    } catch (error) {
      console.error("Error while submitting form:", error);
    }
  };

  return (
    <Box width="100%" maxW="md" mx="auto" p={6}>
      <form onSubmit={handleSubmit}>
        <Box mb={4}>
          <label style={{ fontSize: "14px", color: "gray.600" }}>제목</label>
          <ChakraInput
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력해주세요."
            size="lg"
            focusBorderColor="purple.500"
            borderColor="gray.400"
            color="white"
            _placeholder={{ color: "gray.500" }}
          />
        </Box>

        <Box mb={4}>
          <label style={{ fontSize: "14px", color: "gray.600" }}>내용</label>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="내용을 입력해주세요."
            size="lg"
            resize="vertical"
            minHeight="150px"
            focusBorderColor="purple.500"
            borderColor="gray.400"
            color="white"
            _placeholder={{ color: "gray.500" }}
          />
        </Box>

        <Box mb={4}>
          <label
            htmlFor="visibility"
            style={{ fontSize: "14px", color: "gray.600" }}
          >
            공개
          </label>
          <select
            id="visibility"
            name="visibility"
            value={formData.state}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "white",
              border: "1px solid #CBD5E0",
              borderRadius: "5px",
              color: "black",
              cursor: "pointer",
            }}
          >
            <option value="선택" color="black">
              선택
            </option>
            <option value="공개">공개</option>
            <option value="비공개">비공개</option>
          </select>
        </Box>

        <Box mb={4}>
          <label style={{ fontSize: "14px", color: "gray.600" }}>
            파일 첨부
          </label>
          <ChakraInput
            type="file"
            name="sources" // "sources"로 수정
            onChange={handleChange}
            accept="audio/*, image/*"
            border="none"
            p={0}
          />
        </Box>

        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            bg="purple.600"
            color="white"
            borderRadius="8px"
            height="36px"
            px={6}
            _hover={{ bg: "purple.700" }}
            _active={{ bg: "purple.800" }}
            _focus={{ boxShadow: "0 0 0 2px rgba(128, 90, 213, 0.6)" }}
          >
            제출
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Input;
