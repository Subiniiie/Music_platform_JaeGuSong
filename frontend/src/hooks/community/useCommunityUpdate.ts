import { useState, ChangeEvent, FormEvent } from 'react';
import { CreateArticleData } from '@/configs/community/createArticleForm';
import { ArticleItem } from '@/configs/community/articleItem';
import { CreateArticleFields } from '@/configs/community/createArticleForm';
import axios from 'axios';

const useCommunityUpdate = () => {
  const [data, setData] = useState<ArticleItem[]>([]);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateArticleData>({
    title: '',
    content: '',
    attachmentFile: '', 
    static: '',
  });

  const fetchArticleDetail = async (id: number) => {
                // 토큰 가져오기
            // try {
            //     const response = await axios.get(
            //         `${API_URL}/api/boards/{id}`,
            //         {
            //             headers: {
            //               access: `${token}`,
            //             },
            //         }
            //     )
            //     const article = response.data
            // setFormData({
            //   title: article.title || '',
            //   content: article.content || '',
            //   attachmentFile: article.attachmentFile || '',
            //   static: article.static || ''
            // });
            // setPreviewFile(article.attachmentFile || null);
            // } catch(error) {
            //     console.error(error)
  };

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

      // 백한테 게시글 수정해서 보내기
  //     try {
  //         const response = await axios.post(
  //             `${API_URL}/api/boards/{boardSeq}`, // API_URL 변수 확인 필요
  //             formDataToSubmit // formDataToSubmit으로 변경
  //         );
  //         console.log(response.data);
  //     } catch (error) {
  //         console.error('게시물 작성 중 오류 발생:', error);
  //     }
  console.log('확인')
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
