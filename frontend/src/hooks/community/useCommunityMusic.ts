import CommunityDetailView from "@/pages/community/community-detail-view";
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";

   
interface Article {
    board_seq: number;
    user_seq: number;
    user_nickname: string;
    user_profile_image: string;
    title: string;
    state: string;
    likeNum: number;
    isLiked: string;
    thumbnail: string;
};


const useCommunityMusic = () => {
    const navigate = useNavigate();

    const goMusicFeedDetail = (article: Article) => {
        navigate(paths.community.detail(article.board_seq));
    }
    return {
        goMusicFeedDetail
    }
}

export default useCommunityMusic;