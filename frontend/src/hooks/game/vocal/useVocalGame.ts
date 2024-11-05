import { useEffect, useRef, useState, useCallback } from "react";
import { NOTES } from "../../../utils/game/vocalSound";

const useVocalGame = () => {
  const [isListening, setIsListening] = useState(false);
  const [targetPitch, setTargetPitch] = useState(NOTES[0]);
  const [level, setLevel] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isMatched, setIsMatched] = useState(false);
  const [ballHeight, setBallHeight] = useState(0);
  const [userFrequency, setUserFrequency] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const [isAudioContextClosed, setIsAudioContextClosed] =
    useState<boolean>(true);

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

    // 오디오 분석 함수
    const analyzeAudio = () => {
      analyserRef.current?.getByteFrequencyData(dataArray);
      const average = getAverageFrequency(dataArray);
      setUserFrequency(average);
      checkMatch(average, targetPitch.frequency);
      requestAnimationFrame(analyzeAudio);
    };

    analyzeAudio();
    // setMessage("게임이 시작되었습니다!");
    setIsStarted(true);
    setIsListening(true);
    setIsAudioContextClosed(false);
  };

  // 음성 청취 중지 함수
  const stopListening = () => {
    if (audioContextRef.current && !isAudioContextClosed) {
      audioContextRef.current
        .close()
        .then(() => {
          microphoneRef.current = null;
          // setMessage("게임이 중단되었습니다.");
          setIsListening(false);
          setIsAudioContextClosed(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // 게임 클리어 및 청취 종료 함수
  const endListening = () => {
    if (audioContextRef.current && !isAudioContextClosed) {
      audioContextRef.current
        .close()
        .then(() => {
          microphoneRef.current = null;
          setMessage("게임을 클리어하였습니다!");
          setIsListening(false);
          setIsAudioContextClosed(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // 주파수 일치 검사 함수
  const checkMatch = useCallback(
    (frequency: number, targetFrequency: number) => {
      const withinRange = Math.abs(frequency - targetFrequency) < 3;
      const heightPercentage = Math.min(
        Math.max((frequency / targetFrequency) * 100, 0),
        80
      );
      setBallHeight(heightPercentage);
      setIsMatched(withinRange);
      if (withinRange && !gameOver) {
        handleNextLevel();
      }
    },
    [gameOver, targetPitch]
  );

  // 평균 주파수 계산 함수
  const getAverageFrequency = (dataArray: Uint8Array) => {
    const sum = dataArray.reduce((acc, value) => acc + value, 0);
    return sum / dataArray.length;
  };

  // 다음 레벨 처리 함수
  const handleNextLevel = () => {
    setLevel((prev) => {
      const newLevel = prev + 1;
      if (newLevel < NOTES.length) {
        setTargetPitch(NOTES[newLevel]);
        setMessage("");
        setBallHeight(1);
      } else {
        setGameOver(true);
        setBallHeight(0);
        endListening();
        setIsStarted(false);
      }
      return newLevel;
    });
  };

  // 게임 초기화 함수
  const resetGame = () => {
    setLevel(0);
    setTargetPitch(NOTES[0]);
    setMessage("");
    setGameOver(false);
    setIsMatched(false);
    setBallHeight(0);
    setUserFrequency(0);
    setIsStarted(true);
    setIsAudioContextClosed(true);
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  // 외부에서 사용할 수 있는 값 반환
  return {
    isListening,
    setIsListening,
    targetPitch,
    level,
    message,
    gameOver,
    ballHeight,
    userFrequency,
    startListening,
    stopListening,
    resetGame,
    setTargetPitch,
    isMatched,
    isStarted,
    setIsStarted,
  };
};

export default useVocalGame;
