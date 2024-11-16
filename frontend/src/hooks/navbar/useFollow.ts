import { useState } from "react";
import axios from "axios"
import useCommon from "../common/common"
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";
import { table } from "console";

export interface FollowUserList {
    artistSeq: number;
    nickname: string;
    thumbnail: string;
};


const useFollow = () => {
    const { API_URL, storedToken } = useCommon();
    const [ followingUserList, setFollowingUserList ] = useState<FollowUserList[]>([]);
    const [ followerUserList, setFollowwerUserList ] = useState<FollowUserList[]>([]);
    const navigate = useNavigate();

    const goFollowingFeed = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/follow/target`,
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                }
            )
            console.log('내가 팔로우한 사람들', response.data)
            setFollowingUserList(response.data)
        } catch(error)  {
            console.error(error)
        }
    };

    const goFollowerFeed = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/follow/fan`,
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                }
            )
            console.log('나를 팔로우한 사람들', response.data)
            setFollowwerUserList(response.data)
        } catch(error) {
            console.error(error)
        }
    }

    const goOtherUserFeed = async (artistSeq: number) => {
        navigate(paths.community.generalCommunity(artistSeq))
    };

    const goUnfollow = async (artistSeq: number) => {
        try {
            const response = await axios.delete(
                `${API_URL}/api/follow`,
                {
                    params: {
                        targetSeq: artistSeq,
                    },
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                }
            )
            console.log('언팔했따')
        } catch(error) {
            console.error(error);
        }
    }

    return {
        goFollowingFeed,
        goOtherUserFeed,
        goUnfollow,
        goFollowerFeed,
        followingUserList,
        followerUserList
    }
}

export default useFollow;