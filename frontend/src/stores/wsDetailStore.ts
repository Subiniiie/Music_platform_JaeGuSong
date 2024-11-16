import { create } from "zustand";
import WaveSurfer from "wavesurfer.js";

interface SessionData {
  startPoint: number;
  endPoint: number;
  check: boolean;
  player: WaveSurfer | null;
  duration: number;
}

interface wsDetailStore {
  sessions: Record<string, SessionData>;
  globalStartPoint: number;
  globalEndPoint: number;
  globalPlayPoint: number;
  globalDuration: number;

  addSession: (sessionId: string, player: WaveSurfer) => void;
  removeSession: (sessionId: string) => void;
  updateSession: (
    sessionId: string,
    data: Partial<SessionData>
  ) => void;
  toggleCheck: (sessionId: string) => void;

  updateGlobalStartPoint: (newStartPoint?: number) => void;
  updateGlobalEndPoint: (newEndPoint?: number) => void;

  recalculateGlobalStartPoint: () => void;
  recalculateGlobalEndPoint: () => void;

  resetStore: () => void;
}

export const useWsDetailStore = create<WsDetailStore>((set, get) => ({
  sessions: {},

  globalStartPoint: 0, // 초기값은 세션의 최소값으로 설정될 예정
  globalEndPoint: 0,
  globalPlayPoint: 0,
  globalDuration: 180,

  addSession: (sessionId, player) =>
    set((state) => {
      const duration = player.getDuration();

      const newSessions = {
        ...state.sessions,
        [sessionId]: { startPoint: 0, endPoint: 0, check: false, player, duration },
      };

      // 세션 추가 후 글로벌 값 재계산
      return {
        sessions: newSessions,
        globalStartPoint: Math.min(
          ...Object.values(newSessions).map((s) => s.startPoint)
        ),
        globalEndPoint: Math.max(
          ...Object.values(newSessions).map((s) => s.endPoint)
        ),
        globalDuration: Math.max(
          ...Object.values(newSessions).map((s) => s.duration || 1800) // duration 중 가장 큰 값
        ),
      };
    }),

  removeSession: (sessionId) =>
    set((state) => {
      const newSessions = { ...state.sessions };
      delete newSessions[sessionId];
      
      // 세션 제거 후 글로벌 값 재계산
      return {
        sessions: newSessions,
        globalStartPoint: Object.keys(newSessions).length
          ? Math.min(...Object.values(newSessions).map((s) => s.startPoint))
          : 0,
        globalEndPoint: Object.values(newSessions).length
          ? Math.max(...Object.values(newSessions).map((s) => s.endPoint))
          : 0,
        globalDuration: Object.keys(newSessions).length
          ? Math.max(...Object.values(newSessions).map((s) => s.duration || 1800))
          : 0, // 세션이 없으면 0으로 초기화
      };
    }),

  updateSession: (sessionId, data) =>
    set((state) => {
      const updatedSessions = {
        ...state.sessions,
        [sessionId]: {
          ...state.sessions[sessionId],
          ...data,
        },
      };

      // 세션 업데이트 후 글로벌 값 재계산
      return {
        sessions: updatedSessions,
        globalStartPoint: Math.min(
          ...Object.values(updatedSessions).map((s) => s.startPoint)
        ),
        globalEndPoint: Math.max(
          ...Object.values(updatedSessions).map((s) => s.endPoint)
        ),
      };
    }),

  ToggleCheck: (sessionId) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [sessionId]: {
          ...state.sessions[sessionId],
          check: !state.sessions[sessionId]?.check,
        },
      },
    })),

  // 유저가 직접 설정하는 경우
  updateGlobalStartPoint: (newStartPoint) =>
    set((state) => ({
      globalStartPoint: newStartPoint ?? state.globalStartPoint,
    })),

  updateGlobalEndPoint: (newEndPoint) =>
    set((state) => ({
      globalEndPoint: newEndPoint ?? state.globalEndPoint,
    })),

  // 재계산 함수
  recalculateGlobalStartPoint: () =>
    set((state) => ({
      globalStartPoint: Math.min(
        ...Object.values(state.sessions).map((s) => s.startPoint)
      ),
    })),

  recalculateGlobalEndPoint: () =>
    set((state) => ({
      globalEndPoint: Math.max(
        ...Object.values(state.sessions).map((s) => s.endPoint)
      ),
    })),

  // 새로운 초기화 함수
  resetStore: () =>
    set(() => ({
      sessions: {},
      globalStartPoint: 0,
      globalEndPoint: 0,
      globalPlayPoint: 0,
      globalDuration: 1800, // 초기화
    }))
}));