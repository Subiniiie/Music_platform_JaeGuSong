import axios from "axios";
import { useState } from "react";

const useCommunityDetail = () => {
    const [ openDeleteModal, setOpenDeleteModal ] = useState<boolean>(false);
    const API_URL =import.meta.env.VITE_API_URL;
    const storedToken = localStorage.getItem('jwtToken');

    // 게시물 삭제
    const deleteArticle = async (id: number) => {
        try {
            const response = await axios.delete(
                `${API_URL}/api/boards/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            })
            console.log('삭제 완')
        } catch(error) {
          console.error(error)
        }
    };


    return {
        openDeleteModal,
        setOpenDeleteModal,
        deleteArticle
    }
}

export default useCommunityDetail;