import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  SigninFormData,
  SigninInputFields,
} from "@/configs/auth/formInputDatas";
import { Box, Button, Input as ChakraInput, Text } from "@chakra-ui/react";
import paths from "@/configs/paths";
import axios, { AxiosError, AxiosResponse } from "axios";
import fetchArtistSeq from "@/hooks/fetchArtistSeq";

const Input: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SigninFormData>({
    userId: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 에러 메시지 상태 추가
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleResponseDto = async (response: AxiosResponse) => {
    try {
      const accessToken = response.headers["authorization"];
      const dtoResponse = await axios.get(`${API_URL}/api/user`, {
        headers: {
          Authorization: `${accessToken}`,
        },
        withCredentials: true,
      });

      // 로그인 성공 후 articeSeq 가져오기
      await fetchArtistSeq();

      navigate(paths.community.main);
    } catch (error) {
      console.warn(error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value)
        formDataToSubmit.append(
          key,
          value instanceof File ? value : String(value)
        );
    });

    // 백한테 로그인 정보 보내기
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, null, {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          email: formData.userId,
          password: formData.password,
        },
        // withCredentials: true,
      });
      const token = response.headers.authorization.split(" ")[1];
      localStorage.setItem("jwtToken", token);
      setErrorMessage(null); // 성공하면 에러 메시지 초기화
      await handleResponseDto(response);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.warn(error);
      if (axiosError.response) {
        setErrorMessage(
          (axiosError.response.data as { message?: string })?.message ||
            "로그인에 실패했습니다. 다시 시도해주세요."
        );
      } else if (axiosError.request) {
        setErrorMessage("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <Box width="100%" maxW="md" mx="auto">
      <form onSubmit={handleSubmit}>
        {SigninInputFields.map((field, index) => (
          <Box key={index} mb={4}>
            <label>{field.label}</label>
            <ChakraInput
              type={field.type}
              name={field.name}
              value={
                (formData[field.name as keyof SigninFormData] as string) || ""
              }
              onChange={handleChange}
              placeholder={
                field.name === "userId"
                  ? "아이디를 입력해주세요"
                  : "비밀번호를 입력해주세요."
              }
              style={{ color: "white", marginTop: "20px" }}
              autoComplete="off"
            ></ChakraInput>
          </Box>
        ))}
        {errorMessage && (
          <Text color="red.500" fontSize="sm" mt={2}>
            {errorMessage}
          </Text>
        )}
        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            _hover={{ backgroundColor: "gray", color: "black" }}
          >
            로그인
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Input;
