import axios from "axios";
import { useState } from "react";

interface Crew {
    crewSeq: number;
    nickname: string;
    profileImage: string;
  }

const useMyCrew = () => {
    const [ crewData, setCrewData ] = useState<Crew[]>([]);

    const getMyCrews = async (crewsInfo: Crew[]) => {
        const API_URL = import.meta.env.VITE_API_URL;
        const storedToken = localStorage.getItem('jwtToken');
        const fetchedCrews: Crew[] = [];
        for (const crewSeq of crewsInfo) {
            try {
                const response = await axios.get(
                    `${API_URL}/api/crew/${crewSeq}`,
                    {
                        headers: {
                            Authorization: `Bearer ${storedToken}` 
                        },
                    }
                )
                fetchedCrews.push(response.data);
            } catch(error) {
                console.warn(error)
            }
        }
        setCrewData(fetchedCrews);
    };

    return {
        getMyCrews,
        crewData
    }
};

export default useMyCrew;