import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  artistSeq: string | null;
  setArtistSeq: (seq: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      artistSeq: null,
      setArtistSeq: (seq) => {
        console.log("Setting artistSeq in zustand:", seq);
        set({ artistSeq: seq });
      },
    }),
    {
      name: "auth-storage", // localStorage에 저장될 키 이름
      getStorage: () => localStorage, // storage 방식 지정 (localStorage)
    }
  )
);

export default useAuthStore;
