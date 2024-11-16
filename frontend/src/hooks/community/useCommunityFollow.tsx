import { useEffect } from "react";
import useCommon from "../common/common";
import axios from "axios";

const useCommunityFollow = () => {
    const { API_URL, getMySeq, id, storedToken, storeMySeq} = useCommon();

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
        } catch(error) {
            console.error(error)
        }
    }

    return {
        makeFollow
    }
}

export default useCommunityFollow;