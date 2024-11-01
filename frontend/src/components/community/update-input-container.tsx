import React from 'react';
import { Button, Box, Textarea, Input as ChakraInput } from '@chakra-ui/react';
import { CreateArticleFields } from '@/configs/community/createArticleForm';
import useCommunityUpdate from '@/hooks/community/useCommunityUpdate';


const UpdateInputContainer: React.FC = () => {
    const {
        previewFile,
        formData,
        handleChange,
        handleSubmit,
      } = useCommunityUpdate();


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
                        value={formData[field.name as keyof CreateArticleData] || ''}
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
                        value={formData[field.name as keyof CreateArticleData] || ''}
                        onChange={handleChange}
                        placeholder={formData.content || '쓰여진 내용 적혀져있음'}
                        color="black"
                        size="lg"
                        resize="vertical"
                        height="180px" 
                    />
                ) : (
                    <ChakraInput
                        type={field.type}
                        name={field.name}
                        value={formData[field.name as keyof CreateArticleData] || ''}
                        onChange={handleChange}
                        placeholder={formData.title || '쓰여진 제목 적혀져있음'}
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

export default UpdateInputContainer;