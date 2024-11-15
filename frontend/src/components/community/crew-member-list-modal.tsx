import React, { useEffect, useState } from "react";
import { Text, Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CrewMemeberListCotainer from "./crew-member-list-container";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Manager {
  seq: number;
  profileImage: string;
  email: string;
  nickname: string;
}

export interface CrewData {
  birth: string;
  content: string;
  crewSeq: number;
  crews: Array<any>;  // crews 데이터의 타입을 구체적으로 정의할 수 있음
  genre: string;
  manager: Manager;
  nickname: string;
  profileImage: string;
  region: string;
}

const CrewMemeberListModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [crewData, setCrewData] = useState<CrewData | null>(null);

  if (!isOpen) return null;
  const { id } = useParams<{ id: string }>();
  const storedToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    const getCrewMembers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/crew/${id}`,
          {
            headers: {
                Authorization: `Bearer ${storedToken}` 
            },
          }
        )
        console.log('크루 정보', response.data)
        setCrewData(response.data);
      } catch(error) {
        console.warn(error)
      }
    }

    getCrewMembers()
  }, [id])

  useEffect(() => {
    console.log('저장완', crewData)
  }, [crewData])

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "30px",
    textAlign: "center",
    width: "450px",
    maxWidth: "800px",
    height: "600px",
    maxHeight: "1200px",
    position: "relative",
  };

  const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "30px",
    right: "30px",
    background: "none",
    border: "none",
    color: "black",
    fontSize: "24px",
    cursor: "pointer",
  };

  return (
    <Box style={overlayStyle} onClick={onClose}>
      <Box style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>
          X
        </button>
        <Text color="black">크루원</Text>
          <CrewMemeberListCotainer crewData={crewData} onClose={onClose} />
      </Box>
    </Box>
  );
};

export default CrewMemeberListModal;
