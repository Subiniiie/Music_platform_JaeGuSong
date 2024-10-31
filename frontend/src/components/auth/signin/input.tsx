import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SigninFormData, SigninInputFields } from '@/configs/auth/formInputDatas';
import { Box, Button, Input as ChakraInput } from '@chakra-ui/react';
import paths from '@/configs/paths';
import axios from 'axios';

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
    // try {
    //     const response = await axios.post(
    //         // URL 고치기
    //         `${API_URL}/api/auth/login`,
    //         {
    //             "email" : formData.userId,
    //             "password" : formData.password,
    //         }
    //     );
          //  navigate(paths.main)
    //     console.log(response.data)
    // const { accessToken, refreshToken } = response.data;

    // // 로컬 스토리지에 저장
    // localStorage.setItem('accessToken', accessToken);
    // localStorage.setItem('refreshToken', refreshToken);
    // } catch(error) {
    //     console.error(error)
    // }
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
                style={{ color: 'black' }}
              ></ChakraInput>
            </Box>
          ))}
          <Button type='submit'>로그인</Button>
        </form>
      </Box>
    );
};

export default Input;