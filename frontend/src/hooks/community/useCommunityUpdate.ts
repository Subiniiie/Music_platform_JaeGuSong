import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { CreateArticleData } from '@/configs/community/createArticleForm';
import { ArticleItem } from '@/configs/community/articleItem';
import { CreateArticleFields } from '@/configs/community/createArticleForm';
import axios from 'axios';

const useCommunityUpdate = () => {
  const [data, setData] = useState<ArticleItem[]>([]);
  const { id } = useParams<{id: string}>();
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState<CreateArticleData>({
    title: '',
    content: '',
    attachmentFile: '', 
    static: '',
  });

  const fetchArticleDetail = useCallback(async (id: number) => {
    const storedToken = localStorage.getItem('jwtToken');
    try {
        const response = await axios.get(
            `${API_URL}/api/boards/${id}`,
            {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
            }
        )
        const article = response.data
      setFormData({
        title: article.title || '',
        content: article.content || '',
        attachmentFile: article.attachmentFile || '',
        static: article.static || ''
      });
      setPreviewFile(article.attachmentFile || null);
    } catch(error) {
      console.error(error)
    }
  }, [API_URL]);

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
    const storedToken = localStorage.getItem('jwtToken');

      // 백한테 게시글 수정해서 보내기
      try {
          const response = await axios.put(
              `${API_URL}/api/boards/${id}`, // API_URL 변수 확인 필요
              formDataToSubmit,
              {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                  'Content-Type': 'multipart/form-data',
                },
              }
          );
          console.log(response.data);
      } catch (error) {
          console.error('게시물 작성 중 오류 발생:', error);
      }
  };

  return {
    data,
    previewFile,
    formData,
    fetchArticleDetail,
    handleChange,
    handleSubmit
  };
};

export default useCommunityUpdate;
