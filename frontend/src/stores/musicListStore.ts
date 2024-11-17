import { create } from "zustand";

export interface MyMusicFeedList {
  name: string;
  originSinger: string;
  originTitle: string;
  state: string;
  thumbnail: string;
  workspaceSeq: number;
}

interface MusicFeedState {
  myMusicFeedList: MyMusicFeedList[];
  setMyMusicFeedList: (list: MyMusicFeedList[]) => void;
}

export const useMusicFeedStore = create<MusicFeedState>((set) => ({
  myMusicFeedList: [],
  setMyMusicFeedList: (list) => set({ myMusicFeedList: list }),
}));
