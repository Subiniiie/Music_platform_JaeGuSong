import { create } from "zustand";

interface HeaderState {
    openUserHeader: boolean;
    setOpenUserHeader: (value: boolean) => void; 

    openOtherUserHeader: boolean;
    setOpenOtherUserHeader: (value: boolean) => void;

    otherUserNickname: string;
    setOtherUserNickname: (value: string) => void;

    otherUserProfileImage: string;
    setOtherUserProfileImage: (value: string) => void;
}


const useHeaderStore = create<HeaderState>((set) => ({
    openUserHeader: true,
    setOpenUserHeader: (value) => set({ openUserHeader: value }),

    openOtherUserHeader: false,
    setOpenOtherUserHeader: (value) => set({ openOtherUserHeader: value}),

    otherUserNickname: '',
    setOtherUserNickname: (value) => set({otherUserNickname: value}),  
    
    otherUserProfileImage: '',
    setOtherUserProfileImage: (value) => set({otherUserProfileImage: value})
}));

export default useHeaderStore;
