import { create } from "zustand";

interface CrewSeqState {
    getCrewSeqStore: number;
    setGetCrewSeqStore: (seq: number) => void;
}

const useCrewSeqStore = create<CrewSeqState>((set) => ({
    getCrewSeqStore: 0,
    setGetCrewSeqStore: (seq) => set({ getCrewSeqStore: seq })
}));

export default useCrewSeqStore;