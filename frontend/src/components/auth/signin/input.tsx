import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SigninFormData, SigninInputFields } from '@/configs/auth/formInputDatas';
import { Box, Button, Input as ChakraInput } from '@chakra-ui/react';
import paths from '@/configs/paths';
import axios, { AxiosError} from 'axios';

const Input: React.FC = () => {
  const navigate = useNavigate();

  const [ formData, setFormData] = useState<SigninFormData>({
    userId: '',
    password: ''
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value}))
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSubmit.append(key, value instanceof File ? value : String(value));
    })

    // 백한테 로그인 정보 보내기
    console.log('로그인하자', formData.userId, formData.password)
    try {
      const response = await axios.post(
        'https://k11e106.p.ssafy.io/api/auth/login', // 쿼리 파라미터는 URL에 추가
        null,
        {
            params: {
                email: formData.userId,
                password: formData.password,
            }
        }
    );
    console.log('로그인 시도', response.data)
    navigate(paths.community.main)
    console.log('로그인 성공 response', response)
    console.log('로그인 성공', response.data)
    // const { accessToken, refreshToken } = response.data;

    // 로컬 스토리지에 저장
    // localStorage.setItem('accessToken', accessToken);
    // localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      const axiosError = error as AxiosError;

      console.log('error')
      if (axiosError.response) {
          // 에러 응답이 있을 경우
          console.error('로그인 에러는:', axiosError.response.data);
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

    return (
      <Box width="100%" maxW="md" mx="auto">
        <form onSubmit={handleSubmit}>
          {SigninInputFields.map((field, index) => (
            <Box key={index} mb={4}>
              <label>{field.label}</label>
              <ChakraInput
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof SigninFormData] as string || ''}
                onChange={handleChange}
                placeholder={field.name === 'userId' ? '아이디를 입력해주세요' : '비밀번호를 입력해주세요.'}
                style={{ color: 'white' }}
              ></ChakraInput>
            </Box>
          ))}
          <Button type='submit'>로그인</Button>
        </form>
      </Box>
    );
};

export default Input;