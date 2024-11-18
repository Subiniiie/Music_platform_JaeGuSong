import { create } from "zustand";
import WaveSurfer from "wavesurfer.js";

interface SessionData {
  startPoint: number;
  endPoint: number;
  type: number;
  check: boolean;
  player: WaveSurfer | null;
  duration: number;
}

interface wsDetailStore {
  sessions: Record<string, SessionData>;
  globalStartPoint: number;
  globalEndPoint: number;
  globalCurrentTime: number;
  globalDuration: number;
  isGlobalPlaying: boolean;
  checkedSessions: string[];
  shouldReloadSessionBox: boolean;

  setSessions: (newSessions) => void;
  addSession: (sessionId: string, player: WaveSurfer) => void;
  removeSession: (sessionId: string) => void;
  updateSession: (sessionId: string, data: Partial<SessionData>) => void;
  // toggleCheck: (sessionId: string) => void;
  setCheck: (sessionId: string, isChecked: boolean) => void;

  updateGlobalStartPoint: (newStartPoint?: number) => void;
  updateGlobalEndPoint: (newEndPoint?: number) => void;

  recalculateGlobalStartPoint: () => void;
  recalculateGlobalEndPoint: () => void;

  resetStore: () => void;

  triggerSessionBoxReload: () => void;

  playAll: () => void;
  pauseAll: () => void;
  stopAll: () => void;
  resetGlobalPlayback: () => void;
}

export const useWsDetailStore = create<WsDetailStore>((set, get) => ({
  sessions: {},

  globalStartPoint: Infinity, // 초기값은 세션의 최소값으로 설정될 예정
  globalEndPoint: 0,
  globalCurrentTime: 0,
  globalDuration: 0,
  isGlobalPlaying: false,
  checkedSessions: [],
  shouldReloadSessionBox: false,

  // 서버에서 받은 세션 데이터를 초기화
  setSessions: (newSessions) =>
    set((state) => {
      const originalSessions = { ...state.sessions }; // 기존 데이터를 복사

      newSessions.forEach((session) => {
        if (!originalSessions[session.soundSeq]) {
          originalSessions[session.soundSeq] = {
            startPoint: session.startPoint,
            endPoint: session.endPoint,
            type: session.type,
            check: false,
            player: null, // wavesurfer는 null로 초기화
            duration: 0,
          };
        }
      });

      return { sessions: originalSessions };
    }),

  addSession: (sessionId, player) =>
    set((state) => {
      const duration = player.getDuration();
      console.log("duration :", duration);

      const newSessions = {
        ...state.sessions,
        [sessionId]: {
          ...state.sessions[sessionId],
          player, // WaveSurfer 인스턴스 저장
          duration,
        },
      };

      const checkedSessions = state.checkedSessions;

      // checkedSessions를 기반으로 globalStartPoint와 globalEndPoint 재계산
      const checkedStartPoints = checkedSessions.map(
        (id) => newSessions[id]?.startPoint ?? Infinity
      );
      const checkedEndPoints = checkedSessions.map(
        (id) => newSessions[id]?.endPoint ?? -Infinity
      );

      // 세션 추가 후 글로벌 값 재계산
      return {
        sessions: newSessions,
        globalStartPoint: checkedStartPoints.length
          ? Math.min(...checkedStartPoints)
          : Infinity, // checkedSessions가 없으면 0으로 초기화
        globalEndPoint: checkedEndPoints.length
          ? Math.max(...checkedEndPoints)
          : 0, // checkedSessions가 없으면 0으로 초기화
        globalDuration: Math.max(
          ...Object.values(newSessions).map((s) => s.duration || 1800) // duration 중 가장 큰 값
        ),
      };
    }),

  removeSession: (sessionId) =>
    set((state) => {
      const newSessions = { ...state.sessions };
      delete newSessions[sessionId];

      const checkedSessions = state.checkedSessions;

      const checkedStartPoints = checkedSessions.map(
        (id) => newSessions[id]?.startPoint ?? Infinity
      );
      const checkedEndPoints = checkedSessions.map(
        (id) => newSessions[id]?.endPoint ?? -Infinity
      );

      // 세션 제거 후 글로벌 값 재계산
      return {
        sessions: newSessions,
        globalStartPoint: checkedStartPoints.length
          ? Math.min(...checkedStartPoints)
          : Infinity, // checkedSessions가 없으면 0으로 초기화
        globalEndPoint: checkedEndPoints.length
          ? Math.max(...checkedEndPoints)
          : 0, // checkedSessions가 없으면 0으로 초기화
        globalDuration: Object.keys(newSessions).length
          ? Math.max(
              ...Object.values(newSessions).map((s) => s.duration || 1800)
            )
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
      console.log(
        "여기는 store. updateSession 실행했고, 글로벌 값 재계산 전이야."
      );
      console.log("Updated sessions:", updatedSessions); // 세션 업데이트 상태 확인

      const checkedSessions = state.checkedSessions;
      console.log("checkedSessions :", checkedSessions);

      // checkedSessions를 기반으로 globalStartPoint와 globalEndPoint 재계산
      const checkedStartPoints = checkedSessions.map(
        (id) => updatedSessions[id]?.startPoint ?? Infinity
      );
      const checkedEndPoints = checkedSessions.map(
        (id) => updatedSessions[id]?.endPoint ?? -Infinity
      );

      console.log("checkedStartPoints :", checkedStartPoints);

      return {
        sessions: updatedSessions,
        globalStartPoint: checkedStartPoints.length
          ? Math.min(...checkedStartPoints)
          : Infinity, // checkedSessions가 없으면 0으로 초기화
        globalEndPoint: checkedEndPoints.length
          ? Math.max(...checkedEndPoints)
          : 0, // checkedSessions가 없으면 0으로 초기화
      };
    }),

  // 세션 체크 상태를 업데이트하는 메서드
  setCheck: (sessionId, isChecked) =>
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return {};

      // 체크 상태 업데이트
      session.check = isChecked;

      const newCheckedSessions = isChecked
        ? [...state.checkedSessions, sessionId]
        : state.checkedSessions.filter((id) => id !== sessionId);

      // 모든 세션 ID 가져오기
      const allSessionIds = Object.keys(state.sessions);

      // 전체 선택 여부 확인
      const isAllChecked =
        allSessionIds.length > 0 &&
        allSessionIds.every((id) => state.sessions[id]?.check);

      // 글로벌 시작/종료 지점 계산
      const checkedSessions = newCheckedSessions.map(
        (id) => state.sessions[id]
      );
      const globalStartPoint = Math.min(
        ...checkedSessions.map((s) => s.startPoint),
        Infinity
      );
      const globalEndPoint = Math.max(
        ...checkedSessions.map((s) => s.endPoint),
        -Infinity
      );

      return {
        sessions: { ...state.sessions, [sessionId]: session },
        checkedSessions: newCheckedSessions,
        isAllChecked, // 전체 선택 상태 동기화
        globalStartPoint: isFinite(globalStartPoint) ? globalStartPoint : 0,
        globalEndPoint: isFinite(globalEndPoint) ? globalEndPoint : 0,
      };
    }),

  playAll: () => {
    const { sessions, checkedSessions, globalStartPoint, globalEndPoint } =
      get();

    console.log("여기는 store. playAll. globalStartPoint :", globalStartPoint);

    checkedSessions.forEach((sessionId) => {
      const session = sessions[sessionId];
      if (!session || !session.player) return;

      // 기존 "audioprocess" 이벤트 제거
      session.player.un("audioprocess");

      session.player.on("audioprocess", () => {
        const currentTime = session.player?.getCurrentTime() || 0;

        // 글로벌 범위에 맞게 재생 위치 강제 설정 (초기 위치에서만 적용)
        if (currentTime < globalStartPoint) {
          session.player.setTime(globalStartPoint);
          return; // setTime 호출 후 종료
        }

        if (
          currentTime < session.startPoint ||
          currentTime > session.endPoint
        ) {
          session.player?.setVolume(0);
        } else {
          session.player.setVolume(1);
        }

        if (currentTime > globalEndPoint) {
          session.player.stop();
          session.player.setTime(globalStartPoint);
          set({ isGlobalPlaying: false });
        }
      });

      session.player.setTime(globalStartPoint);
      session.player.play();
    });

    set({ isGlobalPlaying: true });
  },

  pauseAll: () => {
    const { sessions, checkedSessions } = get();
    checkedSessions.forEach((sessionId) => {
      const session = sessions[sessionId];
      session?.player?.pause();
    });

    set({ isGlobalPlaying: false });
  },

  stopAll: () => {
    const { sessions, checkedSessions, globalStartPoint } = get();
    checkedSessions.forEach((sessionId) => {
      const session = sessions[sessionId];
      session?.player?.stop();
      session?.player?.setTime(globalStartPoint);
    });

    set({ isGlobalPlaying: false, globalCurrentTime: globalStartPoint });
  },

  resetGlobalPlayback: () =>
    set(() => ({
      globalCurrentTime: 0,
      isGlobalPlaying: false,
      checkedSessions: [],
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
      globalCurrentTime: 0,
      globalDuration: 1800, // 초기화
    })),

  triggerSessionBoxReload: () =>
    set((state) => ({ shouldReloadSessionBox: !state.shouldReloadSessionBox })),
}));
