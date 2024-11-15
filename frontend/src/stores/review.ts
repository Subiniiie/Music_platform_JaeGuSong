import { create } from "zustand";

interface ReviewState {
    changeReview: boolean;
    setChangeReview: (value: boolean) => void;
}

const useReviewStore = create<ReviewState>((set) => ({
    changeReview: false,
    setChangeReview: (value) => set({ changeReview: value })
}))

export default useReviewStore;