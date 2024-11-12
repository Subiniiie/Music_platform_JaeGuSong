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
import { messaging } from "@/services/firebaseConfig";
import { getToken } from "firebase/messaging";

const Input: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SigninFormData>({
    userId: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPIDKEY;

  // 알림 권한 요청 함수
  const requestNotificationPermission = async (): Promise<boolean> => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("알림 권한이 허용되었습니다.");
        return true;
      } else {
        console.warn("알림 권한이 거부되었습니다.");
        alert(
          "알림 권한을 허용하면 중요한 공지와 업데이트를 받아볼 수 있습니다!"
        );
        return false;
      }
    } catch (error) {
      console.error("알림 권한 요청 실패:", error);
      return false;
    }
  };

  // FCM 토큰 가져오기
  const fetchFCMToken = async (): Promise<string | null> => {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      const fcmToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      if (fcmToken) {
        console.log("FCM 토큰:", fcmToken);
        return fcmToken;
      } else {
        console.warn("FCM 토큰을 가져오지 못했습니다.");
        return null;
      }
    } catch (error) {
      console.error("FCM 토큰 가져오기 실패:", error);
      return null;
    }
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

      // 로그인 성공 후 artistSeq 가져오기
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

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, null, {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          email: formData.userId,
          password: formData.password,
        },
      });

      const token = response.headers.authorization.split(" ")[1];
      localStorage.setItem("jwtToken", token);

      // 알림 권한 요청
      const hasPermission = await requestNotificationPermission();

      // 알림 권한이 허용된 경우 FCM 토큰 가져오기
      if (hasPermission) {
        const fcmToken = await fetchFCMToken();
        if (fcmToken) {
          localStorage.setItem("fcmToken", fcmToken);
          console.log("FCM 토큰 저장 성공:", fcmToken);
        } else {
          console.warn("FCM 토큰 저장 실패.");
        }
      }

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
