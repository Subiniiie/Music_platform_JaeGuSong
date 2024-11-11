import { create } from "zustand";

interface HeaderState {
    openUserHeader: boolean;
    setOpenUserHeader: (value: boolean) => void; 
}


const useHeaderStore = create<HeaderState>((set) => ({
    openUserHeader: true,
    setOpenUserHeader: (value) => set({ openUserHeader: value }),
}));

export default useHeaderStore;
