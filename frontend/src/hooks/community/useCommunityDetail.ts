import axios from "axios";
import { useState } from "react";
import paths from "@/configs/paths";
import { useNavigate } from "react-router-dom";
import { toaster } from "@/components/ui/toaster"


const useCommunityDetail = () => {
    const [ openDeleteModal, setOpenDeleteModal ] = useState<boolean>(false);
    const API_URL =import.meta.env.VITE_API_URL;
    const storedToken = localStorage.getItem('jwtToken');
    const navigate = useNavigate();

    // 게시물 삭제
    const deleteArticle = async (id: number) => {
        try {
            console.log(`삭제 요청 보냄: ${id}`);
                const response = await axios.delete(
                    `${API_URL}/api/boards/${id}`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    });
                    setOpenDeleteModal(false)
                    toaster.create({
                        description: "게시물이 삭제되었습니다.",
                        type: "error"
                    })
                    console.log('바꿔라')
                    navigate(paths.community.myCommunity)
        } catch (error) {
            console.error("게시물 삭제 중 오류 발생:", error);
            if (error.response) {
                console.error("서버 응답 오류:", error.response.data);
            }
        }
    };


    return {
        openDeleteModal,
        setOpenDeleteModal,
        deleteArticle
    }
}

export default useCommunityDetail;