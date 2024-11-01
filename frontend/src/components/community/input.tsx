import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { CreateArticleData, CreateArticleFields } from '@/configs/community/createArticleForm';
import { Box, Button, Input as ChakraInput, Textarea } from '@chakra-ui/react';


const Input: React.FC = () => {
    const [previewFile, setPreviewFile] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateArticleData>({
        title: '',
        content: '',
        attachmentFile: '',
        static: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (name === 'profileImage' && files) {
            const file = files[0];
            setFormData((prevFormData) => ({ ...prevFormData, profileImage: file }));
            const previewUrl = URL.createObjectURL(file);
            setPreviewFile(previewUrl);
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataToSubmit.append(key, value instanceof File ? value : String(value));
        });

        // 백한테 새로운 게시물 정보 보내기
    //     try {
    //         const response = await axios.post(
    //             `${API_URL}/api/boards`, // API_URL 변수 확인 필요
    //             formDataToSubmit // formDataToSubmit으로 변경
    //         );
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error('게시물 작성 중 오류 발생:', error);
    //     }
    console.log('확인')
    };

    return (
        <Box width="100%" maxW="md" mx="auto">
            <form onSubmit={handleSubmit}>
                {CreateArticleFields.map((field, index) => (
                    <Box key={index} mb={4}>
                        <label>{field.label}</label>
                        {field.type === 'select' ? (
                            <select
                                name={field.name}
                                onChange={handleChange}
                                value={field.name !== 'profileImage' ? (formData[field.name as keyof CreateArticleData] as string || '') : undefined}
                                style={{ color: 'black' }}
                            >
                                <option value='' style={{ color: 'black' }}>선택</option>
                                {field.options?.map((option, idx) => (
                                    <option key={idx} value={option} style={{ color: 'black' }}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                                        ) : field.type === 'textarea' ? (
                            <Textarea
                                name={field.name}
                                value={formData[field.name as keyof CreateArticleData] as string || ''}
                                onChange={handleChange}
                                placeholder={field.name === 'content' ? '내용을 입력해주세요' : ''}
                                color="black"
                                size="lg"
                                resize="vertical"
                                height="180px" 
                            />
                        ) : (
                            <ChakraInput
                                type={field.type}
                                name={field.name}
                                value={field.name !== 'profileImage' ? (formData[field.name as keyof CreateArticleData] as string || '') : undefined}
                                onChange={handleChange}
                                placeholder={field.name === 'title' ? '제목을 입력해주세요.' : ''}
                                accept={field.type === 'file' ? 'image/*' : undefined}
                                size="lg"
                            />
                        )}
                    </Box>
                ))}
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
