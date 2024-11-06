import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupFormData, SignupInputFields } from '@/configs/auth/formInputDatas';
import axios, { AxiosError } from 'axios';
import paths from '@/configs/paths';

const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
const phoneRule = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;


const useSignup = () => {
    const navigate = useNavigate();
    const API_URL =import.meta.env.VITE_API_URL;
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [notices, setNotices] = useState<Record<string, string>>({});
    const [verifyBtn, setVerifyBtn] = useState<boolean>(false);
    const [verifyNumber, setVertifyNumber] = useState<boolean>(false);
    const [submitSignup, setSubmitSignup] = useState<boolean>(false);
    const [isStepValid, setIsStepValid] = useState<boolean>(false);
    const [ openSignupModal, setOpenSignupModal ] = useState<boolean>(false);
    const [formData, setFormData] = useState<SignupFormData>({
        userId: '',
        confirmNumber: '',
        password: '',
        confirmPassword: '',
        userName: '',
        nickname: '',
        gender: '',
        birthday: '',
        region: '',
        position: '',
        genre: '',
        phoneNumber: '',
        profileImage: '/profileImage.png'
    });


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'file' && e.target instanceof HTMLInputElement) {
            const files = e.target.files; // 파일 입력에서 files를 가져옴
            if (files && files.length > 0) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: files[0] // 첫 번째 파일만 사용
                }));
            }
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        }

        let message = '';
        let stepValid = isStepValid;

        if (name === 'userId') {
            if (exptext.test(value)) {
                message = '확인되었습니다.';
                setVerifyBtn(true);
            } else {
                message = '올바른 이메일 형식을 입력해주세요.';
                setVerifyBtn(false);
            }
        } else if (name === 'confirmPassword') {
            message = value === formData.password ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.';
            stepValid = value === formData.password;
        } else if (name === 'userName') {
            stepValid = true;
            message = '2글자 이상 한글로 입력해주세요.'
        } else if (name === 'nickname' && value.length >= 1 && value.length <= 20) {
            stepValid = true;
        } else if (name === 'phoneNumber') {
            message = phoneRule.test(value) ? '' : '올바른 번호 형식을 입력해주세요.';
            stepValid = phoneRule.test(value);
        }

        setNotices((prevNotices) => ({
            ...prevNotices,
            [name]: message
        }));

        setIsStepValid(stepValid);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let noticeMessage = '';

        if (name === 'password' && (value.length < 8 || value.length > 16)) {
            noticeMessage = '비밀번호는 8-16글자 사이로 입력해주세요.';
        }

        setNotices((prevNotices) => ({
            ...prevNotices,
            [name]: noticeMessage
        }));
    };

    const sendVerifyNumber = async () => {
        // 인증 이메일 전송하는 코드
        try {
            const response = await axios.post(
                // URL 고치기
                `${API_URL}/api/auth/email`, 
                {'email' : formData.userId}
            )
            console.log(response.data)
            setVertifyNumber(true);
        } catch(error) {
            console.error(error)
        }
    };

    const checkverifyNumber = async () => {
        // 인증 번호 확인하는 코드
        try {
            const response = await axios.post(
                // URL 고치기
                 `${API_URL}/api/auth/email/code`, 
                {
                    'email' : formData.userId,
                    'code' : formData.confirmNumber
                }
            )
            console.log(response.data)
            setSubmitSignup(true);
            setIsStepValid(true);
        } catch(error) {
            console.error(error)
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log('formData:', formData)
           
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataToSubmit.append(key, value instanceof File ? value : String(value));
        })
        // 백한테 회원가입 정보 보내기
        try {
            console.log('회원가입 시도')
            const response = await axios.post(
                // URL 고치기
                 `${API_URL}/api/auth/join`,
                {
                    "email" : formData.userId,
                    "password" : formData.password,
                    "name" : formData.userName,
                    "nickname" : formData.nickname,
                    "gender" : formData.gender,
                    "birth" : formData.birthday,
                    "region" : formData.region,
                    "position" :formData.position,
                    "genre" : formData.genre,
                    "profileImage" : formData.profileImage
                },
            );
               navigate(paths.auth.signIn)
            console.log('나 성공!', response.data)
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                // 에러 응답이 있을 경우
                console.error('회원가입 에러는:', axiosError.response.data);
                console.error('상태 코드:', axiosError.response.status);
            } else if (axiosError.request) {
                // 요청이 서버로 전송되지 않은 경우
                console.error('요청이 서버로 전송되지 않았습니다:', axiosError.request);
            } else {
                // 기타 오류
                console.error('설정 오류:', axiosError.message);
            }
        }
    };

    const handleNextStep = () => {
        if (currentStep === 0) {
            if (isStepValid) {          // 첫 번째 단계에서 다음 버튼 클릭 시, 두 번째 단계로 이동
                setCurrentStep(1);
            }
        } else if (currentStep === 1) {
            if (isStepValid) {          // 두 번째 단계에서 다음 버튼 클릭 시, 유저 이름 입력 페이지로 이동
                setCurrentStep(2);
            }
        } else if (currentStep > 1) {
            if (currentStep === 10) {
                setOpenSignupModal(true);
            } else if (isStepValid) {     // 그 이후 단계는 SignupInputFields 배열에 따라 표시
                setCurrentStep(currentStep + 1);
            }
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
            [SignupInputFields[currentStep + 2].name]: file,
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
        handleChange,
        handleBlur,
        sendVerifyNumber,
        checkverifyNumber,
        handleSubmit,
        handleNextStep,
        handlePrevStep,
        handleFileChange,
        setOpenSignupModal
    }
}

export default useSignup;