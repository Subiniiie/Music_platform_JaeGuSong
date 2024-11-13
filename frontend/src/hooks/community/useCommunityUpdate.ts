import { useState, useCallback, ChangeEvent, FormEvent, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreateArticleData } from '@/configs/community/createArticleForm';
import { ArticleItem } from '@/configs/community/articleItem';
import axios from 'axios';
import paths from '@/configs/paths';

const useCommunityUpdate = () => {
  const [ data ] = useState<ArticleItem[]>([]);
  const { id } = useParams<{id: string}>();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateArticleData>({
    title: '',
    content: '',
    sources: '', 
    state: '',
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
        sources: article.sources || null,
        state: article.state === "PUBLIC" ? "공개" : "비공개"
      });
    } catch(error) {
      console.error(error)
    }
  }, [API_URL]);

  useEffect(() => {
  }, [formData])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type, value, files } = e.target as HTMLInputElement;

    if (type === "file" && files) {
      const selectedFiles = files; // 첫 번째 파일을 가져옵니다.
      setFormData((prevFormData) => ({
        ...prevFormData,
        attachmentFile: selectedFiles, // 파일을 formData의 attachmentFile 상태에 저장
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value, // 텍스트 값 처리
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const formDataToSubmit = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "state") {
        formDataToSubmit.append(key, value === "공개" ? "공개" : "비공개");
      } else if (value) {
        formDataToSubmit.append(key, value instanceof File ? value : String(value));
      }
    });
    const storedToken = localStorage.getItem('jwtToken');

    const boardRequestDto = {
      artistSeq: id,
      title: formData.title,
      state: formData.state,
      content: formData.content,
    };

    formDataToSubmit.append(
      "boardRequestDto",
      new Blob([JSON.stringify(boardRequestDto)], { type: "application/json" })
    );
    
    // 백한테 게시글 수정해서 보내기
    try {
      const response = await axios.post(
        `${API_URL}/api/boards/${id}`, // API_URL 변수 확인 필요
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      navigate(paths.community.detail(id))
      
    } catch (error) {
      console.error('게시물 작성 중 오류 발생:', error);
    }
  };

  return {
    data,
    formData,
    fetchArticleDetail,
    handleChange,
    handleSubmit
  };
};

export default useCommunityUpdate;
