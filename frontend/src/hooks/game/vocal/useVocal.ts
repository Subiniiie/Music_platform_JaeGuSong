import { useState, useEffect } from "react";

const useVocal = (targetFrequency: number, onAboveTarget: () => void) => {
  const [userFrequency, setUserFrequency] = useState<number | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    let analyser: AnalyserNode | null = null;
    let dataArray: Float32Array | null = null;
    let mediaStream: MediaStream | null = null;

    const detectPitch = () => {
      if (!audioContext || !analyser || !dataArray) return;

      analyser.getFloatFrequencyData(dataArray);
      const maxIndex = dataArray.reduce(
        (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
        0
      );
      const detectedFrequency =
        (audioContext.sampleRate * maxIndex) / analyser.fftSize;
      setUserFrequency(detectedFrequency);
      if (detectedFrequency > targetFrequency) {
        onAboveTarget(); // 목표 주파수를 초과하면 콜백 호출
      }
    };

    const initAudio = async () => {
      if (audioContext && audioContext.state === "closed") {
        setAudioContext(
          new (window.AudioContext || (window as any).webkitAudioContext)()
        );
      } else if (!audioContext) {
        const newAudioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        setAudioContext(newAudioContext);
      }

      // 안전하게 currentAudioContext를 설정
      const currentAudioContext = audioContext;

      if (currentAudioContext) {
        // null 체크 추가
        analyser = currentAudioContext.createAnalyser();
        analyser.fftSize = 2048;
        dataArray = new Float32Array(analyser.frequencyBinCount);

        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const source =
            currentAudioContext.createMediaStreamSource(mediaStream);
          source.connect(analyser);
        } catch (error) {
          console.error(error);
        }

        const interval = setInterval(detectPitch, 1500);
        return () => {
          clearInterval(interval);
          mediaStream?.getTracks().forEach((track) => track.stop());
        };
      }
    };

    initAudio();

    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [targetFrequency, onAboveTarget, audioContext]);

  return { userFrequency }; // 감지된 주파수 반환
};

export default useVocal;
