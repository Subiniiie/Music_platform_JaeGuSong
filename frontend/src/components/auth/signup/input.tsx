import React, { ChangeEvent, useState } from "react";
import {
  SignupFormData,
  SignupInputFields,
} from "@/configs/auth/formInputDatas";
import {
  Box,
  Button,
  Flex,
  Input as ChakraInput,
  Text,
} from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox"
import Modal from "@/components/common/Modal";
import useSignup from "@/hooks/auth/useSignup";

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
    verifyMessage,
    handleChange,
    handleBlur,
    sendVerifyNumber,
    checkverifyNumber,
    handleSubmit,
    handleNextStep,
    handlePrevStep,
    handleFileChange,
    setOpenSignupModal,
  } = useSignup();
  
  const [ isChecked, setIsChecked ] = useState(false);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
  };


  return (
    <Box width="100%" maxW="md" mx="auto">
      <form onSubmit={handleSubmit}>
        {currentStep === 0 && (
          <>
            <Box mb={4}>
              <Text fontWeight="medium" color="white" mb={2}>
                아이디
              </Text>
              <Flex alignItems="center" gap={2}>
                <ChakraInput
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="abc@abc.com"
                  borderRadius="md"
                  boxShadow="sm"
                  flex="1"
                />
                <Button
                  onClick={sendVerifyNumber}
                  disabled={!verifyBtn}
                  colorScheme="purple"
                  size="sm"
                  ml={2}
                  _hover={{ backgroundColor: "gray", color: "black" }}
                >
                  인증 번호 전송
                </Button>
              </Flex>
              {notices["userId"] && (
                <Text color="red.500" mt={2}>
                  {notices["userId"]}
                </Text>
              )}
              {verifyMessage && (
                <Text fontWeight="bold" color="green.500" mt={2}>
                  {verifyMessage}
                </Text>
              )}
            </Box>

            <Box mb={4}>
              <Text fontWeight="medium" color="white" mb={2}>
                인증 번호
              </Text>
              <Flex alignItems="center" gap={2}>
                <ChakraInput
                  type="text"
                  name="confirmNumber"
                  value={formData.confirmNumber}
                  onChange={handleChange}
                  placeholder="인증 번호 입력"
                  borderRadius="md"
                  boxShadow="sm"
                  flex="1"
                />
                <Button
                  onClick={checkverifyNumber}
                  disabled={!verifyNumber}
                  colorScheme="purple"
                  size="sm"
                  ml={2}
                  _hover={{ backgroundColor: "gray", color: "black" }}
                >
                  인증
                </Button>
              </Flex>
              {submitSignup && (
                <Text color="green.500" mt={2}>
                  인증되었습니다.
                </Text>
              )}
            </Box>
          </>
        )}
        {currentStep === 1 && (
          <>
            <Box mb={4} mt={2}>
              <label>비밀번호</label>
              <ChakraInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="비밀번호 입력"
                style={{
                  color: "white",
                  background: "#02001F",
                  border: "1px solid",
                  borderRadius: "5px",
                  borderColor: "white",
                  marginTop: "20px",
                }}
                autoComplete="off"
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
                style={{
                  color: "white",
                  background: "#02001F",
                  border: "1px solid",
                  borderRadius: "5px",
                  borderColor: "white",
                  marginTop: "20px",
                }}
                autoComplete="off"
              />
              {notices["confirmPassword"] && (
                <Text
                  color={
                    notices["confirmPassword"] === "비밀번호가 일치합니다."
                      ? "green.500"
                      : "red.500"
                  }
                  mt={2}
                >
                  {notices["confirmPassword"]}
                </Text>
              )}
            </Box>
          </>
        )}
        {currentStep > 1 && SignupInputFields[currentStep + 2] && (
          <Box mb={4}>
            <label>{SignupInputFields[currentStep + 2].label}</label>
            {SignupInputFields[currentStep + 2].type === "select" ? (
              <select
                name={SignupInputFields[currentStep + 2].name}
                onChange={handleChange}
                onBlur={handleBlur}
                value={
                  typeof formData[
                    SignupInputFields[currentStep + 2]
                      .name as keyof SignupFormData
                  ] === "string"
                    ? (formData[
                        SignupInputFields[currentStep + 2]
                          .name as keyof SignupFormData
                      ] as string)
                    : ""
                }
                style={{
                  color: "white",
                  background: "#02001F",
                  border: "1px solid",
                  borderRadius: "5px",
                  borderColor: "white",
                  padding: "0.5rem",
                  marginLeft: "10px",
                }}
              >
                <option>선택</option>
                {SignupInputFields[currentStep + 2].options?.map(
                  (option, idx) => (
                    <option key={idx} value={option} style={{ color: "white" }}>
                      {option}
                    </option>
                  )
                )}
              </select>
            ) : SignupInputFields[currentStep + 2].type === "file" ? (
              <input
                type="file"
                name={SignupInputFields[currentStep + 2].name}
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                style={{
                  color: "white",
                  background: "#02001F",
                  border: "1px solid",
                  borderRadius: "5px",
                  borderColor: "white",
                  padding: "0.5rem",
                  marginLeft: "10px",
                }}
              />
            ) : (
              <ChakraInput
                type={SignupInputFields[currentStep + 2].type}
                name={SignupInputFields[currentStep + 2].name}
                value={
                  typeof formData[
                    SignupInputFields[currentStep + 2]
                      .name as keyof SignupFormData
                  ] === "string"
                    ? (formData[
                        SignupInputFields[currentStep + 2]
                          .name as keyof SignupFormData
                      ] as string)
                    : ""
                }
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={
                  SignupInputFields[currentStep + 2].name === "phoneNumber"
                    ? "010-0000-0000"
                    : undefined
                }
                style={{
                  color: "white",
                  background: "#02001F",
                  border: "1px solid",
                  borderRadius: "5px",
                  borderColor: "white",
                  padding: "0.5rem",
                  marginTop: "20px",
                }}
              />
            )}
            {notices[SignupInputFields[currentStep + 2].name] && (
              <div style={{ color: "red", marginTop: "10px" }}>
                {notices[SignupInputFields[currentStep + 2].name]}
              </div>
            )}
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" mt={4}>
          {currentStep > 0 && (
            <Button
              onClick={handlePrevStep}
              style={{ marginTop: "20px" }}
              _hover={{ backgroundColor: "gray", color: "black" }}
            >
              이전
            </Button>
          )}
          {currentStep >= 0 && currentStep < 10 && (
            <Button
              onClick={handleNextStep}
              disabled={!isStepValid}
              style={{ marginTop: "20px" }}
              _hover={{ backgroundColor: "gray", color: "black" }}
            >
              다음
            </Button>
          )}
          {currentStep == 10 && (
            <Button
              onClick={() => setOpenSignupModal(true)}
              marginTop="20px"
              _hover={{ backgroundColor: "gray", color: "black" }}
            >
              회원가입
            </Button>
          )}
          {currentStep == 10 && (
            <Modal
              isOpen={openSignupModal}
              onClose={() => setOpenSignupModal(false)}
            >
              <Box padding="5px 20px">
                <Text color="black" marginTop="40px" whiteSpace="pre-line">
                  재구송을 통해 일어나는 모든 창작 활동에 대해{"\n"} 
                  재구송은 저작권 책임을 지지 않습니다.
                </Text>
                <Checkbox  
                  marginTop="20px"
                  marginBottom="15px" 
                  variant="subtle" 
                  color="#02001F"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCheckboxChange(e)}
                >
                  동의
                </Checkbox>
                <Box
                  margin="10px"
                  display="flex"
                  justifyContent="center"
                  gap="30px"
                >
                  <Button
                    type="submit"
                    width="150px"
                    _hover={{ backgroundColor: "gray", color: "black" }}
                    disabled={!isChecked}
                  >
                    회원가입 하기
                  </Button>
                </Box>
              </Box>
            </Modal>
          )}
        </Box>
      </form>
      {/* </Box>
      </form> */}
    </Box>
  );
};

export default Input;
