import { useState } from "react";
import { useParams } from "react-router-dom";

const useCommon = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const storedToken = localStorage.getItem('jwtToken');

    const [ storeMySeq, setStoreMySeq ] = useState<string>("");

    const { id } = useParams<string>();


    const getMySeq = () => {
        const authStorage = localStorage.getItem("auth-storage");
    
        if (authStorage) {
            try {
            const parsedData = JSON.parse(authStorage);
            setStoreMySeq(parsedData?.state?.artistSeq || "");
            } catch (error) {
            console.error("Failed to parse auth-storage:", error);
            }
        }
    }
    return {
        API_URL,
        storedToken,
        storeMySeq,
        id,
        getMySeq

    }
}

export default useCommon;