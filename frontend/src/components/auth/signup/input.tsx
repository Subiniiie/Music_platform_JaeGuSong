import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupFormData, SignupInputFields } from '@/configs/auth/formInputDatas';
import { Box, Button, Input as ChakraInput } from '@chakra-ui/react';
import axios from 'axios';
import paths from '@/configs/paths';

const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
const phoneRule = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

const Input: React.FC = () => {
    const navigate = useNavigate();

    const [notices, setNotices] = useState<Record<string, string>>({});
    const [verifyBtn, setVerifyBtn] = useState<boolean>(false);
    const [verifyNumber, setVertifyNumber] = useState<boolean>(false);
    const [submitSignup, setSubmitSignup] = useState<boolean>(false);
    const [isStepValid, setIsStepValid] = useState<boolean>(false);
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

    const [currentStep, setCurrentStep] = useState<number>(0);

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
        } else if (name === 'userName' && value.length >= 2 && value.length <= 10) {
            message = '확인되었습니다.';
            stepValid = true;
        } else if (name === 'nickname' && value.length >= 1 && value.length <= 20) {
            message = '확인되었습니다.';
            stepValid = true;
        } else if (name === 'phoneNumber') {
            message = phoneRule.test(value) ? '확인되었습니다.' : '올바른 번호 형식을 입력해주세요.';
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
                'https://k11e106.p.ssafy.io/api/auth/email', 
                {'email' : formData.userId}
            )
            console.log(response.data)
        } catch(error) {
            console.error(error)
        }

        setVertifyNumber(true);
    };

    const checkverifyNumber = async () => {
        // 인증 번호 확인하는 코드
        console.log('보낸다', formData.userId)
        console.log('보낸다', formData.confirmNumber)
        try {
            const response = await axios.post(
                // URL 고치기
                'https://k11e106.p.ssafy.io/api/auth/email/code', 
                {
                    'email' : formData.userId,
                    'code' : formData.confirmNumber
                }
            )
            console.log(response.data)
        } catch(error) {
            console.error(error)
        }
        setSubmitSignup(true);
        setIsStepValid(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        console.log('formData:', formData)
           
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataToSubmit.append(key, value instanceof File ? value : String(value));
        })
        let newGender = '';

        if (formData.gender === '남성') {
            newGender = 'M'
        } else if (formData.gender === '여성') {
            newGender = 'F'
        } else {
            newGender = 'E'
        }
        // 백한테 회원가입 정보 보내기
        try {
            const response = await axios.post(
                // URL 고치기
                'https://k11e106.p.ssafy.io/api/auth/join',
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
                }
            );
               navigate(paths.main)
            console.log('나 성공!', response.data)
        } catch(error) {
            console.error(error.response.data)
        }

    };

    const handleNextStep = () => {
        if (currentStep === 0) {
            // 첫 번째 단계에서 다음 버튼 클릭 시, 두 번째 단계로 이동
            if (isStepValid) {
                setCurrentStep(1);
            }
        } else if (currentStep === 1) {
            // 두 번째 단계에서 다음 버튼 클릭 시, 유저 이름 입력 페이지로 이동
            if (isStepValid) {
                setCurrentStep(2);
            }
        } else if (currentStep > 1) {
            // 그 이후 단계는 SignupInputFields 배열에 따라 표시
            if (isStepValid) {
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

    return (
        <Box width="100%" maxW="md" mx="auto">
            <form onSubmit={handleSubmit}>
                {currentStep === 0 && (
                    <>
                        <Box mb={4}>
                            <label>아이디</label>
                            <ChakraInput
                                type="text"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="abc@abc.com"
                                style={{ color: 'black', background: 'white', borderColor: 'black' }}
                            />
                            {notices['userId'] && <div style={{ color: 'red' }}>{notices['userId']}</div>}
                            <Button onClick={sendVerifyNumber} disabled={!verifyBtn}>인증 번호 전송</Button>
                        </Box>

                        <Box mb={4}>
                            <label>인증 번호</label>
                            <ChakraInput
                                type="text"
                                name="confirmNumber"
                                value={formData.confirmNumber}
                                onChange={handleChange}
                                placeholder="인증 번호 입력"
                                style={{ color: 'black', background: 'white', borderColor: 'black' }}
                            />
                            {verifyNumber && <Button onClick={checkverifyNumber}>인증</Button>}
                            {submitSignup && '인증되었습니다.'}
                        </Box>
                    </>
                )}

                {currentStep === 1 && (
                    <>
                        <Box mb={4}>
                            <label>비밀번호</label>
                            <ChakraInput
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="비밀번호 입력"
                                style={{ color: 'black', background: 'white', borderColor: 'black' }}
                            />
                        </Box>

                        <Box mb={4}>
                            <label>비밀번호 확인</label>
                            <ChakraInput
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="비밀번호 확인"
                                style={{ color: 'black', background: 'white', borderColor: 'black' }}
                            />
                            {notices['confirmPassword'] && <div style={{ color: 'red' }}>{notices['confirmPassword']}</div>}
                        </Box>
                    </>
                )}

{currentStep > 1 && SignupInputFields[currentStep + 2] && (
    <Box mb={4}>
        <label>{SignupInputFields[currentStep + 2].label}</label>
        {SignupInputFields[currentStep + 2].type === 'select' ? (
            <select
                name={SignupInputFields[currentStep + 2].name}
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData[SignupInputFields[currentStep + 2].name as keyof SignupFormData] || ''}
                style={{ color: 'black', background: 'white', borderColor: 'black', padding: '0.5rem' }}
            >
                <option>선택</option>
                {SignupInputFields[currentStep + 2].options?.map((option, idx) => (
                    <option key={idx} value={option} style={{ color: 'black' }}>
                        {option}
                    </option>
                ))}
            </select>
        ) : SignupInputFields[currentStep + 2].type === 'file' ? (
            <input
                type="file"
                name={SignupInputFields[currentStep + 2].name}
                onChange={(e) => {
                    if (e.target.files) {
                        handleFileChange(e.target.files[0]);
                    }
                }}
                style={{ color: 'black', background: 'white', borderColor: 'black', padding: '0.5rem' }}
            />
        ) : (
            <ChakraInput
                type={SignupInputFields[currentStep + 2].type}
                name={SignupInputFields[currentStep + 2].name}
                value={formData[SignupInputFields[currentStep + 2].name as keyof SignupFormData] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={SignupInputFields[currentStep + 2].name === 'phoneNumber' ? '010-0000-0000' : undefined}
                style={{ color: 'black', background: 'white', borderColor: 'black', padding: '0.5rem' }}
            />
        )}
        {notices[SignupInputFields[currentStep + 2].name] && (
            <div style={{ color: 'red' }}>{notices[SignupInputFields[currentStep + 2].name]}</div>
        )}
    </Box>
)}


                <Box display="flex" justifyContent="space-between" mt={4}>
                    {currentStep > 0 && <Button onClick={handlePrevStep}>이전</Button>}
                    {currentStep >= 0 && currentStep < 11 && <Button 
                        onClick={handleNextStep} 
                        isDisabled={!isStepValid}
                    >
                        다음
                    </Button>
                    }
                    {currentStep == 11 && <Button type='submit'>회원가입</Button>}
                </Box>
            </form>
        </Box>
    );
};

export default Input;
