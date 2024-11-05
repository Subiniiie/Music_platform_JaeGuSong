import { useEffect, useRef, useState, useCallback } from "react";

const useVocalGame = () => {
  const [isListening, setIsListening] = useState(false);
  const [userFrequency, setUserFrequency] = useState(0);
  const [obstacles, setObstacles] = useState<any[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // 음성 청취 시작 함수
  const startListening = async () => {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    microphoneRef.current =
      audioContextRef.current.createMediaStreamSource(stream);
    microphoneRef.current.connect(analyserRef.current);
    analyserRef.current.fftSize = 2048;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const analyzeAudio = () => {
      analyserRef.current?.getByteFrequencyData(dataArray);
      const averageFrequency = getAverageFrequency(dataArray);
      setUserFrequency(averageFrequency);
      requestAnimationFrame(analyzeAudio);
    };

    analyzeAudio();
    setIsListening(true);
  };

  const stopListening = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close().then(() => {
        microphoneRef.current = null;
        setIsListening(false);
      });
    }
  };

  const getAverageFrequency = (dataArray: Uint8Array) => {
    const sum = dataArray.reduce((acc, value) => acc + value, 0);
    return sum / dataArray.length;
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return {
    isListening,
    userFrequency,
    startListening,
    stopListening,
  };
};

export default useVocalGame;
