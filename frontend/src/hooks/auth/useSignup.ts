import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { SignupFormData } from "@/configs/auth/formInputDatas";
import paths from "@/configs/paths";

const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
const phoneRule =
  /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

const useSignup = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [notices, setNotices] = useState<Record<string, string>>({});
  const [verifyBtn, setVerifyBtn] = useState<boolean>(false);
  const [verifyNumber, setVertifyNumber] = useState<boolean>(false);
  const [submitSignup, setSubmitSignup] = useState<boolean>(false);
  const [isStepValid, setIsStepValid] = useState<boolean>(false);
  const [openSignupModal, setOpenSignupModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignupFormData>({
    userId: "",
    confirmNumber: "",
    password: "",
    confirmPassword: "",
    userName: "",
    nickname: "",
    gender: "",
    birthday: "",
    region: "",
    position: "",
    genre: "",
    phoneNumber: "",
    profileImage: "/profileImage.png",
  });
  const [verifyMessage, setVerifyMessage] = useState<string>("");

  // 전화번호 포맷팅
  const formatPhoneNumber = (phone: string) => {
    return phone
      .replace(/[^0-9]/g, "")
      .replace(
        /^(01[016789]{1})(\d{3,4})(\d{4})$/,
        (match, p1, p2, p3) => `${p1}-${p2}-${p3}`
      );
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    let formattedValue = value;
    if (name === "phoneNumber") {
      formattedValue = formatPhoneNumber(value);
    }

    if (type === "file" && e.target instanceof HTMLInputElement) {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: files[0],
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedValue,
      }));
    }

    let message = "";
    let stepValid = isStepValid;

    if (name === "userId") {
      if (exptext.test(value)) {
        setVerifyBtn(true);
      } else {
        message = "올바른 이메일 형식을 입력해주세요.";
        setVerifyBtn(false);
      }
    } else if (name === "confirmPassword") {
      const isMatching = value === formData.password;
      message = isMatching
        ? "비밀번호가 일치합니다."
        : "비밀번호가 일치하지 않습니다.";
      stepValid = isMatching;
    } else if (name === "userName") {
      stepValid = true;
      message = "2글자 이상 한글로 입력해주세요.";
    } else if (name === "nickname" && value.length >= 1 && value.length <= 20) {
      stepValid = true;
    } else if (name === "phoneNumber") {
      message = phoneRule.test(formattedValue)
        ? ""
        : "올바른 번호 형식을 입력해주세요.";
      stepValid = phoneRule.test(formattedValue);
    }

    setNotices((prevNotices) => ({
      ...prevNotices,
      [name]: message,
    }));

    setIsStepValid(stepValid);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let noticeMessage = "";

    if (name === "password" && (value.length < 8 || value.length > 16)) {
      noticeMessage = "비밀번호는 8-16글자 사이로 입력해주세요.";
    }

    setNotices((prevNotices) => ({
      ...prevNotices,
      [name]: noticeMessage,
    }));
  };

  const sendVerifyNumber = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/email`, {
        email: formData.userId,
      });
      console.log(response.data);
      setVertifyNumber(true);
      setVerifyMessage("인증 메일을 확인해주세요!");
    } catch (error) {
      console.error(error);
      setVerifyMessage("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const checkverifyNumber = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/email/code`, {
        email: formData.userId,
        code: formData.confirmNumber,
      });
      console.log(response.data);
      setSubmitSignup(true);
      setIsStepValid(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const joinFormData = new FormData();

    const joinDto = {
      birth: formData.birthday,
      name: formData.userName,
      nickname: formData.nickname,
      region: formData.region,
      genre: formData.genre,
      email: formData.userId,
      password: formData.password,
      gender: formData.gender,
      position: formData.position,
    };

    joinFormData.append(
      "joinDto",
      new Blob([JSON.stringify(joinDto)], { type: "application/json" })
    );

    if (formData.profileImage) {
      joinFormData.append("profileImage", formData.profileImage);
      console.log('이미ㅣㄴ 젛었다', formData.profileImage)
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/join`,
        joinFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate(paths.auth.signIn);
      console.log("회원가입 성공!", response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("회원가입 에러:", axiosError.response.data);
      } else if (axiosError.request) {
        console.error("요청이 서버로 전송되지 않았습니다:", axiosError.request);
      } else {
        console.error("설정 오류:", axiosError.message);
      }
    }
  };

  const handleNextStep = () => {
    if (isStepValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsStepValid(true);
    }
  };

  const handleFileChange = (file: File) => {
    setFormData({
      ...formData,
      profileImage: file,
    });
  };

  return {
    notices,
    verifyBtn,
    verifyNumber,
    submitSignup,
    isStepValid,
    formData,
    currentStep,
    openSignupModal,
    verifyMessage,
    setFormData,
    handleChange,
    handleBlur,
    sendVerifyNumber,
    checkverifyNumber,
    handleSubmit,
    handleNextStep,
    handlePrevStep,
    handleFileChange,
    setOpenSignupModal,
  };
};

export default useSignup;
