import { useState, useEffect } from "react";
import axios from "axios"
import useCommon from "../common/common"
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";

export interface FollowUserList {
    artistSeq: number;
    nickname: string;
    thumbnail: string;
};


const useFollow = () => {
    const { API_URL, getMySeq, id, storeMySeq, storedToken } = useCommon();
    const [ followingUserList, setFollowingUserList ] = useState<FollowUserList[]>([]);
    const [ followerUserList, setFollowwerUserList ] = useState<FollowUserList[]>([]);
    const [ getFollowed, setGetFollowed ] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        getMySeq()
    }, [API_URL, storedToken, id])

    const makeFollow = async () => {
        try {
            console.log('보낼거', storeMySeq, id, storedToken)
            const response = await axios.post(
                `${API_URL}/api/follow`,
                {
                    "targetSeq": id,
                    "fanSeq": storeMySeq
                },
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    },
                }
            )
            console.log('팔로우 요청 완료', response.data)
            setGetFollowed(true)
        } catch(error) {
            console.error(error)
        }
    }

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
        console.log('나 언팔로우할거임', artistSeq)
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
            setGetFollowed(false);

        } catch(error) {
            console.error(error);
        }
    }

    return {
        makeFollow,
        goFollowingFeed,
        goOtherUserFeed,
        goUnfollow,
        goFollowerFeed,
        getFollowed,
        followingUserList,
        followerUserList
    }
}

export default useFollow;