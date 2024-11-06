import { create } from "zustand";
import WaveSurfer from "wavesurfer.js";

// 상태의 타입 정의
interface WsDetailState {
  volume: number;
  setVolume: (volume: number) => void;

  isPlaying: boolean;
  togglePlay: () => void;

  checkedSessions: Set<string>;
  toggleSession: (sessionId: string) => void;

  // 전체 재생/정지 기능
  playAll: () => void;
  pauseAll: () => void;
  stopAll: () => void;

  // 세션의 WaveSurfer 인스턴스 관리
  sessionPlayers: Map<string, WaveSurfer>;
  addSession: (sessionId: string, player: WaveSurfer) => void;
  removeSession: (sessionId: string) => void;
}

// Zustand 스토어 생성
export const useWsDetailStore = create<WsDetailState>((set) => ({
  volume: 0.5,
  setVolume: (newVolume: number) => set({ volume: newVolume }),

  isPlaying: false,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  checkedSessions: new Set(),
  toggleSession: (sessionId) =>
    set((state) => {
      const updatedCheckedSessions = new Set(state.checkedSessions);
      if (updatedCheckedSessions.has(sessionId)) {
        updatedCheckedSessions.delete(sessionId);
      } else {
        updatedCheckedSessions.add(sessionId);
      }
      return { checkedSessions: updatedCheckedSessions };
    }),

  // WaveSurfer 인스턴스 관리
  sessionPlayers: new Map(),
  addSession: (sessionId, player) =>
    set((state) => {
      const updatedPlayers = new Map(state.sessionPlayers);
      updatedPlayers.set(sessionId, player);
      return { sessionPlayers: updatedPlayers };
    }),
  removeSession: (sessionId) =>
    set((state) => {
      const updatedPlayers = new Map(state.sessionPlayers);
      updatedPlayers.delete(sessionId);
      return { sessionPlayers: updatedPlayers };
    }),

  playAll: () => {
    set((state) => {
      state.checkedSessions.forEach((sessionId) => {
        const player = state.sessionPlayers.get(sessionId);
        if (player && !player.isPlaying()) player.play(); // isPlaying 체크 추가
      });
      return {}; // 상태 변경 없이 빈 객체 반환
    });
  },

  pauseAll: () => {
    set((state) => {
      state.checkedSessions.forEach((sessionId) => {
        const player = state.sessionPlayers.get(sessionId);
        if (player) {
          player.pause(); // 전체 세션에 대해 일시정지 실행
        }
      });
      return { isPlaying: false }; // 전체 재생 상태 해제
    });
  },

  stopAll: () => {
    set((state) => {
      state.checkedSessions.forEach((sessionId) => {
        const player = state.sessionPlayers.get(sessionId);
        if (player && player.isPlaying()) player.stop(); // isPlaying 체크 추가
      });
      return {}; // 상태 변경 없이 빈 객체 반환
    });
  },
}));
