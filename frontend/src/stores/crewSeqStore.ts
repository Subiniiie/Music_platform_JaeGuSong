import { create } from "zustand";

interface CrewSeqState {
    getCrewSeq: number;
    setGetCrewSeq: (seq: number) => void;
}

const useCrewSeqStore = create<CrewSeqState>((set) => ({
    getCrewSeq: 0,
    setGetCrewSeq: (seq) => set({ getCrewSeq: seq })
}));

export default useCrewSeqStore;