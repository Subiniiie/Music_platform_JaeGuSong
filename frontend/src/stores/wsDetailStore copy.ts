import { create } from "zustand";
import WaveSurfer from "wavesurfer.js";

// Zustand 스토어에서 관리할 상태와 기능들을 정의
interface WsDetailState2 {
  isPlaying: boolean; // 전체 재생 여부 상태
  togglePlay: () => void; // 전체 재생 상태를 토글하는 함수

  checkedSessions: Set<string>; // 선택된 세션들을 관리하는 Set
  toggleSession: (sessionId: string) => void; // 특정 세션의 선택 상태를 토글하는 함수

  // 전체 시작/종료 지점
  globalStartPoint: number; // 전체 시작 지점
  globalEndPoint: number; // 전체 종료 지점
  updateGlobalPoints: () => void; // checkedSessions 기반으로 전체 시작/종료 지점 업데이트
  setGlobalStartPoint: (time: number) => void; // 시작 지점을 사용자 지정
  setGlobalEndPoint: (time: number) => void; // 종료 지점을 사용자 지정

  // 선택된 세션 전체에 대해 ㅐ생/일시정지/정지 기능을 수행하는 함수들
  playAll: () => void;
  pauseAll: () => void;
  stopAll: () => void;

  // 세션의 WaveSurfer 인스턴스 관리
  sessionPlayers: Map<string, WaveSurfer>; // 세션별 WaveSurfer 인스턴스들을 관리하는 Map
  addSession: (sessionId: string, player: WaveSurfer) => void; // 새로운 세션 추가
  removeSession: (sessionId: string) => void; // 세션 제거
}

// Zustand 스토어 생성
export const useWsDetailStore2 = create<WsDetailState>((set, get) => ({
  isPlaying: false,
  globalStartPoint: 0,
  globalEndPoint: 0,
  // startPoint: 0,
  // endPoint: 0,

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  checkedSessions: new Set(),
  toggleSession: (sessionId) =>
    set((state) => {
      const updatedCheckedSessions = new Set(state.checkedSessions);
      if (updatedCheckedSessions.has(sessionId)) {
        updatedCheckedSessions.delete(sessionId); // 이미 선택된 세션이면 제거
      } else {
        updatedCheckedSessions.add(sessionId); // 선택되지 않은 세션이면 추가
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

  // 전체(선택된 세션) 시작/종료 지점 업데이트
  updateGlobalPoints: () => {
    const { checkedSessions, sessionPlayers } = get();
    if (checkedSessions.size === 0) {
      set({ globalStartPoint: 0, globalEndPoint: 0 });
      return;
    }

    let minStart = Infinity;
    let maxEnd = 0;

    checkedSessions.forEach((sessionId) => {
      const player = sessionPlayers.get(sessionId);
      if (player) {
        const duration = player.getDuration();
        const startPoint = player.getCurrentTime();
        minStart = Math.min(minStart, startPoint);
        maxEnd = Math.max(maxEnd, duration);
      }
    });

    set({ globalStartPoint: minStart, globalEndPoint: maxEnd });
  },

  setGlobalStartPoint: (time) => set({ globalStartPoint: time }),
  setGlobalEndPoint: (time) => set({ globalEndPoint: time }),

  // 전체(선택된 세션) 재생
  playAll: () => {
    set((state) => {
      state.checkedSessions.forEach((sessionId) => {
        const player = state.sessionPlayers.get(sessionId);
        if (player && !player.isPlaying()) {
          player.setTime(state.globalStartPoint); // 시작 지점 설정
          player.play();
        }
      });
      return { isPlaying: true };
    });
  },

  // 전체(선택된 세션) 일시정지
  pauseAll: () => {
    set((state) => {
      state.checkedSessions.forEach((sessionId) => {
        const player = state.sessionPlayers.get(sessionId);
        if (player) {
          player.pause();
        }
      });
      return { isPlaying: false };
    });
  },

  // 전체(선택된 세션) 정지
  stopAll: () => {
    set((state) => {
      state.checkedSessions.forEach((sessionId) => {
        const player = state.sessionPlayers.get(sessionId);
        if (player && player.isPlaying()) {
          player.stop();
          player.setTime(state.globalStartPoint); // 시작 지점으로 설정
        }
      });
      return { isPlaying: false };
    });
  },

  // // 전체(선택된 세션) 재생
  // playAll: () => {
  //   set((state) => {
  //     state.checkedSessions.forEach((sessionId) => {
  //       const player = state.sessionPlayers.get(sessionId);
  //       if (player && !player.isPlaying()) player.play(); // isPlaying 체크 추가
  //     });
  //     return { isPlaying: true };
  //   });
  // },

  // // 전체(선택된 세션) 일시정지
  // pauseAll: () => {
  //   set((state) => {
  //     state.checkedSessions.forEach((sessionId) => {
  //       const player = state.sessionPlayers.get(sessionId);
  //       if (player) {
  //         player.pause(); // 전체 세션에 대해 일시정지 실행
  //       }
  //     });
  //     return { isPlaying: false }; // 전체 재생 상태 해제
  //   });
  // },

  // // 전체(선택된 세션) 정지
  // stopAll: () => {
  //   set((state) => {
  //     state.checkedSessions.forEach((sessionId) => {
  //       const player = state.sessionPlayers.get(sessionId);
  //       if (player && player.isPlaying()) {
  //         player.stop(); // isPlaying 체크 추가
  //         player.setTime(state.startPoint); // 시작 지점으로 설정
  //       }
  //     });
  //     return { isPlaying: false };
  //   });
  // },
}));
