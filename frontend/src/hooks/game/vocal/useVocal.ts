import { useEffect, useState } from "react";

interface WindowWithWebAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const useVocal = (
  targetFrequency: number | null,
  isMicActive: boolean,
  onTargetReached: () => void
) => {
  const [userFrequency, setUserFrequency] = useState<number | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const startDetection = async () => {
      if (!isMicActive || targetFrequency === null) return;

      const AudioContext =
        window.AudioContext ||
        (window as WindowWithWebAudio).webkitAudioContext;
      const newAudioContext = new AudioContext();
      setAudioContext(newAudioContext); // audioContext를 상태로 저장합니다.
      const analyser = newAudioContext.createAnalyser();

      // 사용자 미디어를 가져오는 부분
      const microphone = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const source = newAudioContext.createMediaStreamSource(microphone);
      source.connect(analyser);
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const detectFrequency = () => {
        analyser.getByteFrequencyData(dataArray);

        let maxIndex = 0;
        for (let i = 1; i < bufferLength; i++) {
          if (dataArray[i] > dataArray[maxIndex]) {
            maxIndex = i;
          }
        }

        const nyquist = newAudioContext.sampleRate / 2;
        const frequency = (maxIndex * nyquist) / bufferLength;

        setUserFrequency(frequency);

        // 주파수가 목표 주파수 ±30 Hz 내에 있을 때 목표 도달 처리
        if (
          frequency >= targetFrequency - 30 &&
          frequency <= targetFrequency + 30
        ) {
          onTargetReached();
        }

        // 1초마다 주파수 감지
        setTimeout(detectFrequency, 500);
      };

      detectFrequency();
    };

    startDetection();

    // cleanup function to stop audio context and microphone
    return () => {
      if (audioContext) {
        audioContext.close(); // 상태로 저장된 audioContext를 클린업에서 사용합니다.
      }
    };
  }, [isMicActive, targetFrequency]);

  return { userFrequency };
};

export default useVocal;
