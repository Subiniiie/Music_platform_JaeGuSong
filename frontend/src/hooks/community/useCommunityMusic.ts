import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";

const useCommunityMusic = () => {
    const navigate = useNavigate();

    const goMusicFeedDetail = (workspaceSeq : number) => {
        navigate(paths.workspace.detail(workspaceSeq));
    }
    return {
        goMusicFeedDetail
    }
}

export default useCommunityMusic;