import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import paths from "@/configs/paths";
import axios from "axios";
import { MakeCrewFormData } from "@/configs/community/makeCrew";
import useCrewSeqStore from '@/stores/crewSeqStore';


const UseCommunityCrew = () => {
    const [ openCrewFollowModal, setopenCrewFollowModal ] = useState<boolean>(false);
    const [ openCrewJoinModal, setopenCrewJoinModal ] = useState<boolean>(false);
    const [ openCrewWithdrawModal, setopenCrewWithdrawModal ] = useState<boolean>(false);
    const [ openCrewMembersModal, setOpenCrewMembersModal ] = useState<boolean>(false);
    const [ openCrewApproveModal, setOpenCrewApproveModal ] = useState<boolean>(false);
    const [ openMakeCrewModal, setMakeCrewModal ] = useState<boolean>(false);
    const [ crewName, setCrewName ] = useState<string>('');
    const [ crewNameSeq, setCrewNameSeq ] = useState<string>('');
    const [ crewManagerName, setCrewManagerName ] = useState<string>('');
    const [ crewProfileImage, setCrewProfileImage ] = useState<string>('');
    const [ crewMakeDate, setCrewMakeDate ] = useState<string>('');
    const [ crewMembers, setCrewMembers ] = useState<any[]>([]);
    const [ myCrewsSeq, setMyCrewsSeq ] = useState<any[]>([]);
    const [ myName, setMyName ] = useState<string>('');
    const getCrewSeq = useCrewSeqStore((state) => state.getCrewSeq);

    const [ makeCrewFormData, setMakeCrewFormData ] = useState<MakeCrewFormData>({
        birth: new Date().toISOString().split('T')[0],
        nickname: '',
        region: '',
        genre: '',
        content: '',
        profileImage: null as File | null,
    });

    const API_URL =import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const { id } = useParams<{id: string}>();

    const goCrewFollow = async () => {
        setopenCrewFollowModal((prev) => !prev);
        // 팔로우 요청 api 연결
        // const response = await axios.post(

        // )
    };
    
    const goJoinCrew = async () => {
        setopenCrewJoinModal((prev) => !prev);
        // 크루 가입 요청 api 연결
        const storedToken = localStorage.getItem('jwtToken');
        // 예시
        const crewSeq =  {id}
        try {
            const response = await axios.post(
                `${API_URL}/api/crew/join`,
                {
                    "crewSeq": crewSeq,
                },
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                }
            )
        } catch(error) {
            console.warn(error)
        }
    };

    const handleCrewApproveModal = async () => {
        // 크루장이 가입 요청 승인
        const storedToken = localStorage.getItem('jwtToken');
        // 요청 받았다고 리스트 필요함
        // 일단은 예시 크루: 4, 유저:8
        const userSeq = 3
        const crewSeq = id
        // 이건 상황 봐가면서 계속 바꾸기
        try {
            const response = await axios.patch(
                `${API_URL}/api/crew/accept`,
                {
                    "userSeq": userSeq,
                    "crewSeq": crewSeq,
                },
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    },
                }
            )
            console.log('크루 가입 신청 승인 완료', response)
        } catch(error) {
            console.warn(error)
        }
    };

    const handleCrewDeclineModal = async () => {
        // 크루장이 가입 요청 거절
        const storedToken = localStorage.getItem('jwtToken');
        // 요청 받았다고 리스트 필요함
        // 일단은 예시 크루: 4, 유저:8
        const userSeq = 8
        const crewSeq = id
        // 이건 상황 봐가면서 계속 바꾸기
        try {
            const response = await axios.patch(
                `${API_URL}/api/crew/decline`,
                {
                    "userSeq": userSeq,
                    "crewSeq": crewSeq,
                },
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    },
                }
            )
            console.log('크루 가입 신청 거절 완료', response)
        } catch(error) {
            console.warn(error)
        }
    };
    
    const goWithdrawCrew = async () => {
        setopenCrewWithdrawModal((prev) => !prev);
        const storedToken = localStorage.getItem('jwtToken');
        // 크루 탈퇴 api 연결
        try {
            const response = await axios.delete(
                `${API_URL}/api/crew/leave`,
                {
                    data: {
                        "crewSeq" : crewNameSeq,
                    },
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    },
                }
            )
            console.log('나 크루 탈퇴했다! 빠이')
            navigate(paths.community.main)
        } catch(error) {
            console.warn(error)
        }
    };
    
    const handleCrewFollowModal = () => {
        setopenCrewFollowModal((prev) => !prev)
    };

    const handleCrewJoinModal = () => {
        setopenCrewJoinModal((prev) => !prev)
    };

    const handleCrewWithdrawModal = () => {
        setopenCrewWithdrawModal((prev) => !prev)
    };

    const handleCrewMembers = () => {
        setOpenCrewMembersModal((prev) => !prev);
    }
    
    useEffect(() => {

    }, [openCrewMembersModal])

    const handleMakeCrewModal = () => {
        setMakeCrewModal((prev) => !prev);
    }
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMakeCrewFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
        
    const makeCrew = async (makeCrewFormData: MakeCrewFormData) => {
        const storedToken = localStorage.getItem('jwtToken');
        
        const formData = new FormData();

        const createDto = {
            birth: makeCrewFormData.birth,
            nickname: makeCrewFormData.nickname,
            region: makeCrewFormData.region,
            genre: makeCrewFormData.genre,
            content: makeCrewFormData.content
        };

        formData.append(
            "createDto",
            new Blob([JSON.stringify(createDto)], { type: "application/json", })
        );

        if (makeCrewFormData.profileImage) {
            formData.append("profile", makeCrewFormData.profileImage);
        }
     

        try {
            console.log('formData', formData)
            const response = await axios.post(
                `${API_URL}/api/crew`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
            )
            setMakeCrewModal((prev) => !prev);
        } catch(error) {
            console.warn(error)
        }
    };

    const getCrewInfo = async () => {
        const storedToken = localStorage.getItem('jwtToken');
        let crewSeq = 0;
        // 임시

        if ( id === undefined ) {
            crewSeq = getCrewSeq;
        } else {
            crewSeq =  parseInt(id)
        }
        try {
          const response = await axios.get(
              `${API_URL}/api/crew/${crewSeq}`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`
              },
            })
            setCrewNameSeq(response.data.crewSeq)
            setCrewName(response.data.nickname)
            setCrewManagerName(response.data.manager.nickname)
            setCrewMakeDate(response.data.birth)
            setCrewMembers(response.data.crews)
            setCrewProfileImage(response.data.profileImage)
          } catch(error) {
            console.warn(error)
          }


    }

    const preGetCrewInfo = async () => {
        const storedToken = localStorage.getItem('jwtToken');
        try {
          const response = await axios.get(
              `${API_URL}/api/user`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`
              },
            })
            setMyCrewsSeq(response.data.crews)
            setMyName(response.data.nickname)
            getCrewInfo()
          } catch(error) {
            console.warn(error)
          }
    }
    

    return {
        openCrewFollowModal,
        openCrewJoinModal,
        openCrewWithdrawModal,
        openCrewMembersModal,
        openMakeCrewModal,
        openCrewApproveModal,
        makeCrewFormData,
        crewNameSeq,
        crewName,
        crewManagerName,
        crewProfileImage,
        crewMakeDate,
        crewMembers,
        myCrewsSeq,
        myName,
        goCrewFollow,
        goJoinCrew,
        goWithdrawCrew,
        setopenCrewFollowModal,
        setopenCrewJoinModal,
        setopenCrewWithdrawModal,
        setOpenCrewApproveModal,
        handleCrewFollowModal,
        handleCrewJoinModal,
        handleCrewApproveModal,
        handleCrewDeclineModal,
        handleCrewWithdrawModal,
        handleCrewMembers,
        handleMakeCrewModal,
        handleChange,
        makeCrew,
        setMakeCrewFormData,
        preGetCrewInfo,
    }
};

export default UseCommunityCrew;