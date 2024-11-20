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

interface OffsetData {
  sessionId: string;
  offset: number;
}

interface PlayPointsData {
  sessionId: string;
  playStartPoint: number;
  playEndPoint: number;
}

interface wsDetailStore {
  sessions: Record<string, SessionData>;
  offsetArray: OffsetData[]; // Offset 관리 추가
  playPoints: PlayPointsData[]; // Offset 관리 추가
  globalStartPoint: number;
  globalEndPoint: number;
  globalCurrentTime: number;
  globalDuration: number;
  isGlobalPlaying: boolean;
  checkedSessions: string[];
  shouldReloadSessionBox: boolean;
  dragOffset: 0; // 드래그 오프셋 상태 추가

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

  updateDragOffset: (offset: number) => void;
  setOffset: (sessionId: string, offset: number) => void; // Offset 저장
  getOffset: (sessionId: string) => number; // 특정 sessionId의 Offset 조회
}

export const useWsDetailStore = create<WsDetailStore>((set, get) => ({
  sessions: {},
  offsetArray: [], // 초기화

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

  // 드래그 오프셋 업데이트
  updateDragOffset: (offset: number) =>
    set(() => ({
      dragOffset: offset,
    })),

  setOffset: (sessionId: string, offset: number) => {
    set((state) => {
      const existingOffsetIndex = state.offsetArray.findIndex(
        (item) => item.sessionId === sessionId
      );

      let newOffsetArray;
      if (existingOffsetIndex !== -1) {
        // 이미 존재하는 sessionId인 경우 값 업데이트
        newOffsetArray = [...state.offsetArray];
        newOffsetArray[existingOffsetIndex].offset = offset;
      } else {
        // 새 sessionId인 경우 추가
        newOffsetArray = [...state.offsetArray, { sessionId, offset }];
      }

      return { offsetArray: newOffsetArray };
    });
  },

  getOffset: (sessionId) => {
    const offsetData = get().offsetArray.find(
      (item) => item.sessionId === sessionId
    );

    console.log("여기는 getOffset");
    console.log("offsetData :", offsetData);
    return offsetData ? offsetData.offset : 0; // 없으면 0 반환
  },

  getPlayPoints: () => {
    console.log("여기는 getPlayPoints");

    const { sessions, getOffset } = get();

    // 모든 세션의 playStartPoint와 playEndPoint 계산
    return Object.keys(sessions).map((id) => {
      const session = sessions[id];
      if (!session)
        return { sessionId: id, playStartPoint: 0, playEndPoint: 0 };

      const offset = getOffset(id) || 0; // 해당 세션의 offset 조회

      return {
        sessionId: id,
        playStartPoint: session.startPoint + offset,
        playEndPoint: session.endPoint + offset,
      };
    });
  },

  recalculateGlobalPoints: () => {
    const { checkedSessions, getPlayPoints } = get();

    // playPoints 계산
    const playPoints = getPlayPoints();

    // checkedSessions에 해당하는 playPoints만 필터링
    const filteredPlayPoints = playPoints.filter((p) =>
      checkedSessions.includes(p.sessionId)
    );

    // 필터링된 playPoints를 기준으로 글로벌 시작/종료점 계산
    const globalStart = Math.min(
      ...filteredPlayPoints.map((p) => p.playStartPoint)
    );
    const globalEnd = Math.max(
      ...filteredPlayPoints.map((p) => p.playEndPoint)
    );

    // 상태 업데이트
    set({
      playPoints, // 계산된 playPoints 저장
      globalStartPoint: globalStart !== Infinity ? globalStart : 0,
      globalEndPoint: globalEnd !== -Infinity ? globalEnd : 0,
    });

    return {
      playPoints,
      globalStartPoint: globalStart !== Infinity ? globalStart : 0,
      globalEndPoint: globalEnd !== -Infinity ? globalEnd : 0,
    };
  },

  playAll: () => {
    const {
      sessions,
      checkedSessions,
      recalculateGlobalPoints,
      offsetArray,
      isGlobalPlaying,
    } = get();

    // 글로벌 포인트 재계산
    const { globalStartPoint, globalEndPoint } = recalculateGlobalPoints();

    checkedSessions.forEach((sessionId) => {
      const session = sessions[sessionId];
      const offsetData = offsetArray.find((p) => p.sessionId === sessionId);
      const offset = offsetData ? offsetData.offset : 0;

      if (!session || !session.player) return;

      const adjustedStartTime = globalStartPoint - offset;

      // 기존 "audioprocess" 이벤트 제거
      session.player.un("audioprocess");

      session.player.on("audioprocess", () => {
        const currentTime = session.player?.getCurrentTime() || 0;

        // 볼륨 조절
        if (
          currentTime >= session.startPoint &&
          currentTime <= session.endPoint
        ) {
          session.player.setVolume(1);
        } else {
          session.player.setVolume(0);
        }

        // 재생 종료 조건
        if (currentTime > globalEndPoint - offset) {
          session.player.stop();
          session.player.setTime(globalStartPoint);
          set({ isGlobalPlaying: false });
          console.log(
            "isGlobalPlaying 정지 상태로 변환 완료.",
            isGlobalPlaying
          );
        }
      });

      // 재생 설정
      if (offset === 0) {
        // Offset이 없을 경우, 글로벌 시작 시간으로 재생
        session.player.setTime(globalStartPoint);
        session.player.play();
      } else {
        // Offset이 있을 경우, 동기화를 위해 딜레이 추가
        if (adjustedStartTime >= 0) {
          // Adjusted Start Time이 음수가 아니면 일반적인 딜레이 처리
          session.player.setTime(adjustedStartTime);
          session.player.play();
        } else {
          // Adjusted Start Time이 음수일 경우, 0초부터 시작
          session.player.setTime(0);
          setTimeout(() => {
            session.player.play();
          }, Math.abs(adjustedStartTime) * 1000); // 음수만큼의 시간 보정
        }
      }
    });

    set({ isGlobalPlaying: true });
  },

  pauseAll: () => {
    const { sessions, checkedSessions } = get();

    checkedSessions.forEach((sessionId) => {
      const session = sessions[sessionId];

      if (session?.player) {
        session.player.pause(); // 재생 중지 (일시정지)
      }
    });

    // 전역 재생 상태를 false로 업데이트
    set({ isGlobalPlaying: false });
  },

  stopAll: () => {
    const { sessions, checkedSessions, recalculateGlobalPoints } = get();

    // 글로벌 포인트 재계산
    const { globalStartPoint } = recalculateGlobalPoints();

    checkedSessions.forEach((sessionId) => {
      const session = sessions[sessionId];

      if (session?.player) {
        session.player.stop(); // 완전한 정지
        session.player.setTime(globalStartPoint); // 글로벌 시작점으로 위치 초기화
      }
    });

    // 전역 재생 상태 및 현재 시간을 초기화
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

  playSession: (sessionId: string) => {
    const session = get().sessions[sessionId];
    if (session && session.player) {
      // 기존 "audioprocess" 이벤트 제거
      session.player.un("audioprocess");

      session.player.on("audioprocess", () => {
        const currentTime = session.player?.getCurrentTime() || 0;

        if (currentTime > session.endPoint) {
          session.player.stop();
          session.player.setTime(session.startPoint);
          set((state) => ({
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...state.sessions[sessionId],
                isPlaying: false,
              },
            },
          }));
        }
      });

      session.player.setTime(session.startPoint);
      session.player.play();
      set((state) => ({
        sessions: {
          ...state.sessions,
          [sessionId]: {
            ...state.sessions[sessionId],
            isPlaying: true,
          },
        },
      }));
    }
  },

  pauseSession: (sessionId: string) => {
    const session = get().sessions[sessionId];
    if (session && session.player) {
      session.player.pause();
      set((state) => ({
        sessions: {
          ...state.sessions,
          [sessionId]: {
            ...state.sessions[sessionId],
            isPlaying: false,
          },
        },
      }));
    }
  },

  stopSession: (sessionId: string) => {
    const session = get().sessions[sessionId];
    if (session && session.player) {
      session.player.stop();
      session.player.setTime(session.startPoint);
      set((state) => ({
        sessions: {
          ...state.sessions,
          [sessionId]: {
            ...state.sessions[sessionId],
            isPlaying: false,
          },
        },
      }));
    }
  },

  updateStartPoint: (sessionId: string, newStartPoint: number) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [sessionId]: {
          ...state.sessions[sessionId],
          startPoint: newStartPoint,
        },
      },
    })),

  updateEndPoint: (sessionId: string, newEndPoint: number) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [sessionId]: {
          ...state.sessions[sessionId],
          endPoint: newEndPoint,
        },
      },
    })),
}));
