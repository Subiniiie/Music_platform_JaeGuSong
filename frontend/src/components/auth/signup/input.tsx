import React from 'react';
import { SignupFormData, SignupInputFields } from '@/configs/auth/formInputDatas';
import { Box, Button, Input as ChakraInput, Text } from '@chakra-ui/react';
import Modal from '@/components/common/Modal';
import useSignup from '@/hooks/auth/useSignup';

const Input: React.FC = () => {
    const {
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
    } = useSignup();


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
                            {verifyNumber && <Button onClick={checkverifyNumber} disabled={!verifyNumber}>인증</Button>}
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
                                value={
                                    typeof formData[SignupInputFields[currentStep + 2].name as keyof SignupFormData] === 'string'
                                    ? (formData[SignupInputFields[currentStep + 2].name as keyof SignupFormData] as string)
                                    : ''
                                }
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
                                    value={
                                        typeof formData[SignupInputFields[currentStep + 2].name as keyof SignupFormData] === 'string'
                                        ? (formData[SignupInputFields[currentStep + 2].name as keyof SignupFormData] as string)
                                        : ''
                                    }
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
                    {currentStep >= 0 && currentStep < 10 && <Button 
                        onClick={handleNextStep} 
                        disabled={!isStepValid}
                    >
                        다음
                        </Button>
                    }
                    {currentStep == 10 && <Button onClick={() => setOpenSignupModal(true)}>
                        회원가입
                    </Button>}
                    {currentStep == 10 && <Modal isOpen={openSignupModal} onClose={() => setOpenSignupModal(false)}>
                        <Box padding=" 5px 20px">
                            <Text color="black" margin="40px">회원가입 하시겠습니까?</Text>
                            <Box 
                                margin="10px"  
                                display="flex" 
                                justifyContent="center"
                                gap="10px"
                            >
                                <Button type="submit" width="75px">예</Button>
                                <Button onClick={() => setOpenSignupModal(false)}  width="75px">아니요</Button>
                            </Box>
                        </Box>  
                    </Modal>}
                </Box>
            </form>
        </Box>
      </form>
    </Box>
  );
};

export default Input;
