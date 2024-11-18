import { useRef, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";

export interface UseSessionProps {
  waveformRef: React.RefObject<HTMLDivElement>;
  wavesurferRef: React.RefObject<WaveSurfer | null>;
  duration: number;
  storeStartPoint: number;
  storeEndPoint: number;
  sessionId: string;
  setCursor1: (value: number) => void;
  setCursor2: (value: number) => void;
  updateStartPoint: (id: string, point: number) => void;
  updateEndPoint: (id: string, point: number) => void;
}

export interface UseSessionReturn {
  handleStartCursorDragStop: (e: any, d: any) => void;
  handleEndCursorDragStop: (e: any, d: any) => void;
}

export function useSession({
  waveformRef,
  wavesurferRef,
  duration,
  storeStartPoint,
  storeEndPoint,
  sessionId,
  setCursor1,
  setCursor2,
  updateStartPoint,
  updateEndPoint,
}: UseSessionProps): UseSessionReturn {
  const startPointRef = useRef(storeStartPoint);
  const endPointRef = useRef(storeEndPoint);

  const handleStartCursorDragStop = useCallback(
    (e, d) => {
      if (!waveformRef.current || !wavesurferRef.current) {
        console.error("Waveform 또는 WaveSurfer가 초기화되지 않았습니다.");
        return;
      }

      const newStartPoint = (d.x / waveformRef.current.clientWidth) * duration;

      if (newStartPoint >= storeEndPoint) {
        console.warn("새로운 시작 지점이 종료 지점을 넘을 수 없습니다.");
        return;
      }

      startPointRef.current = newStartPoint;
      updateStartPoint(sessionId, newStartPoint);
      setCursor1(newStartPoint);

      const currentTime = wavesurferRef.current.getCurrentTime() || 0;
      if (currentTime < newStartPoint) {
        wavesurferRef.current.setTime(newStartPoint);
      }
    },
    [waveformRef, wavesurferRef, duration, storeEndPoint, sessionId, updateStartPoint, setCursor1]
  );

  const handleEndCursorDragStop = useCallback(
    (e, d) => {
      if (!waveformRef.current || !wavesurferRef.current) {
        console.error("Waveform 또는 WaveSurfer가 초기화되지 않았습니다.");
        return;
      }

      const newEndPoint = (d.x / waveformRef.current.clientWidth) * duration;

      if (newEndPoint < storeStartPoint) {
        console.warn("새로운 종료 지점이 시작 지점을 넘을 수 없습니다.");
        return;
      }

      endPointRef.current = newEndPoint;
      updateEndPoint(sessionId, newEndPoint);
      setCursor2(newEndPoint);

      const currentTime = wavesurferRef.current.getCurrentTime() || 0;
      if (currentTime > newEndPoint) {
        wavesurferRef.current.setTime(newEndPoint);
      }
    },
    [waveformRef, wavesurferRef, duration, storeStartPoint, sessionId, updateEndPoint, setCursor2]
  );

  return {
    handleStartCursorDragStop,
    handleEndCursorDragStop,
  };
}
