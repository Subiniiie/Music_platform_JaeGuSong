import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";

export interface UserInfo {
    birth: string;
    content: string | null;
    crews: number[];
    email: string;
    gender: string;
    genre: string;
    name: string;
    nickname: string;
    position: string;
    profileImage: File | null;
    region: string;
    seq: number;
}

const useMyInfo = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [myInfo, setMyInfo] = useState<UserInfo | null>(null); // 단일 객체로 변경

    const fetchUserInfo = async () => {
        try {
            const storedToken = localStorage.getItem('jwtToken');
            if (!storedToken) return;

            const response = await axios.get(`${API_URL}/api/user`, {
                headers: { Authorization: `Bearer ${storedToken}` },
                withCredentials: true,
            });
            setMyInfo(response.data); // API 응답 데이터를 myInfo 상태로 설정
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const updateMyInfo = async (changes: Partial<UserInfo>) => {
        try {
            const storedToken = localStorage.getItem('jwtToken');
            if (!storedToken) return;

            const response = await axios.post(`${API_URL}/api/user`, changes, {
                headers: { Authorization: `Bearer ${storedToken}` },
            });
        } catch (error) {
            console.error('Error updating user info:', error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        const { name, value, type } = e.target;

        setMyInfo((prevFormData: UserInfo | null) => {
            const updatedFormData: UserInfo = {
                // prevFormData가 null일 경우 기본값을 설정
                ...(prevFormData ?? {
                    birth: '',
                    content: null,
                    crews: [],
                    email: '',
                    gender: '',
                    genre: '',
                    name: '',
                    nickname: '',
                    position: '',
                    profileImage: null,
                    region: '',
                    seq: 0,
                }),
            };

            if (type === 'file' && e.target instanceof HTMLInputElement) {
                const files = e.target.files;
                if (files && files.length > 0) {
                    updatedFormData.profileImage = files[0]; // profileImage 필드에 파일 저장
                }
            } else {
                // name을 keyof UserInfo로 단언하여 타입을 명확히 함
                updatedFormData[name as keyof UserInfo] = value;
            }

            return updatedFormData;
        });
    };

    const createOrUpdateMyInfo = async (userData: UserInfo) => {
        try {
            const storedToken = localStorage.getItem('jwtToken');
            if (!storedToken) return;

            const response = await axios.post(`${API_URL}/api/user`, userData, {
                headers: { Authorization: `Bearer ${storedToken}` },
            });
        } catch (error) {
            console.error('Error creating/updating user info:', error);
        }
    };

    // useEffect(() => {
    //     fetchUserInfo(); // 컴포넌트가 마운트될 때 fetchUserInfo 호출
    // }, []);

    return {
        myInfo,
        createOrUpdateMyInfo,
        setMyInfo,
        updateMyInfo,
        handleChange,
    };
};

export default useMyInfo;
