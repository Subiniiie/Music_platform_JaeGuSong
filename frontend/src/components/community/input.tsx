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
  const getCrewSeq = useCrewSeqStore((state) => state.getCrewSeq);
  const setGetCrewSeq = useCrewSeqStore((state) => state.setGetCrewSeq);
  // let artistSeq: number | null = null;
  const [artistSeq, setArtistSeq] = useState<number | null>(null);

  // if (authStorage) {
  //   try {
  //     console.log('id는', getCrewSeq)
  //     if ( getCrewSeq !== 0 ) {
  //       artistSeq = getCrewSeq
  //       setGetCrewSeq(0)
  //     } else {
  //     const parsedData = JSON.parse(authStorage);
  //     artistSeq = parsedData?.state?.artistSeq || null;
  //     }
  //     console.log('어디에서 제출???', artistSeq)
  //   } catch (error) {
  //     console.error("Failed to parse auth-storage:", error);
  //   }
  // }

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
    attachmentFile: null as File | null,
    static: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value, files } = e.target as HTMLInputElement;

    if (type === "file" && files) {
      const selectedFile = files[0]; // 첫 번째 파일을 가져옵니다.
      setFormData((prevFormData) => ({
        ...prevFormData,
        attachmentFile: selectedFile, // 파일을 formData의 attachmentFile 상태에 저장
      }));
    } else if (name === "visibility") {  // select에 대해서 특별히 처리
      setFormData((prevFormData) => ({
        ...prevFormData,
        static: value, // select의 값은 static에 반영
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

    const formDataToSubmit = new FormData();

    const boardRequestDto = {
      artistSeq: artistSeq,
      title: formData.title,
      state: formData.static,
      content: formData.content,
    };

    formDataToSubmit.append(
      "boardRequestDto",
      new Blob([JSON.stringify(boardRequestDto)], { type: "application/json" })
    );

    if (formData.attachmentFile) {
      formDataToSubmit.append("files", formData.attachmentFile);
    }


    try {
      const response = await axios.post(
        `${API_URL}/api/boards`,
        formDataToSubmit,
        // boardRequestDto,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      setGetCrewSeq(0); // 상태를 0으로 리셋
      navigate(paths.community.myCommunity);
    } catch (error) {
      console.error("Error while submitting form:", error);
    }
  };

  return (
    <Box width="100%" maxW="md" mx="auto">
      <form onSubmit={handleSubmit}>
        <Box mb={4}>
          <label>제목</label>
          <ChakraInput
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력해주세요."
            size="lg"
          />
        </Box>

        <Box mb={4}>
          <label>내용</label>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="내용을 입력해주세요."
            size="lg"
            resize="vertical"
          />
        </Box>
        <Box mb={4}>
          <label htmlFor="visibility" style={{ fontSize: "16px", color: "white" }}>공개</label>
          <select
            id="visibility"
            name="visibility"
            value={formData.static}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "#02001F",
              border: "1px solid #fff",
              borderRadius: "5px",
              color: "gray",
              cursor: "pointer",
            }}
          >
            <option value="선택">선택</option>
            <option value="공개">공개</option>
            <option value="비공개">비공개</option>
          </select>
        </Box>
        <Box mb={4}>
          <label>파일 첨부</label>
          <ChakraInput
            type="file"
            name="attachmentFile" // name을 attachmentFile로 수정
            onChange={handleChange}
            accept="audio/*, image/*"
          />
        </Box>

        <Button
          type="submit"
          border="solid 2px #9000FF"
          borderRadius="15px"
          height="30px"
          width="auto"
        >
          제출
        </Button>
      </form>
    </Box>
  );
};

export default Input;
