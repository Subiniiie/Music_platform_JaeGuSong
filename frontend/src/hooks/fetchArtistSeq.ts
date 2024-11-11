import axios from "axios";
import useAuthStore from "@/stores/authStore";

const API_URL = import.meta.env.VITE_API_URL;

const fetchArtistSeq = async () => {
  try {
    const storedToken = localStorage.getItem("jwtToken");

    const response = await axios.get(`${API_URL}/api/user`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    const artistSeq = response.data.seq;
    console.log("zustand에 저장할 artistSeq :", artistSeq);
    useAuthStore.getState().setArtistSeq(artistSeq); // Zustand에 저장

    return artistSeq;
  } catch (error) {
    console.error("Error fetching artistSeq:", error);
    throw error;
  }
};

export default fetchArtistSeq;
