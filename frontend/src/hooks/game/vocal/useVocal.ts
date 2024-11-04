import { useEffect, useRef, useState, useCallback } from "react";

// 브라우저 호환성을 위한 ExtendedWindow 인터페이스
interface ExtendedWindow extends Window {
  webkitAudioContext?: typeof AudioContext; // Safari 브라우저에서 AudioContext 사용을 위한 정의
}

// 주파수 매칭을 위한 커스텀 훅
const useVocal = (targetFrequency: number) => {
  // 상태 변수 정의
  const [isMatched, setIsMatched] = useState(false); // 음성이 목표 주파수와 일치하는지 여부
  const [ballHeight, setBallHeight] = useState(0); // 공의 높이
  const [isListening, setIsListening] = useState(false); // 음성을 듣고 있는지 여부
  const [userFrequency, setUserFrequency] = useState(0); // 사용자의 주파수

  // 오디오 관련 참조 변수
  const audioContextRef = useRef<AudioContext | null>(null); // AudioContext 객체
  const analyserRef = useRef<AnalyserNode | null>(null); // AnalyserNode 객체
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null); // 마이크로폰 소스

  // 음성 청취 시작 함수
  const startListening = async () => {
    const AudioContext =
      window.AudioContext || (window as ExtendedWindow).webkitAudioContext; // AudioContext 생성
    audioContextRef.current = new AudioContext(); // 새로운 AudioContext 인스턴스 생성
    analyserRef.current = audioContextRef.current.createAnalyser(); // AnalyserNode 생성
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // 오디오 스트림 요청
    microphoneRef.current =
      audioContextRef.current.createMediaStreamSource(stream); // 오디오 스트림 소스 생성
    microphoneRef.current.connect(analyserRef.current); // 마이크로폰과 AnalyserNode 연결
    analyserRef.current.fftSize = 2048; // FFT 크기 설정

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount); // 주파수 데이터 저장 배열 생성

    // 오디오 분석 함수
    const analyzeAudio = () => {
      analyserRef.current?.getByteFrequencyData(dataArray); // 주파수 데이터를 dataArray에 가져오기
      const average = getAverageFrequency(dataArray); // 평균 주파수 계산
      setUserFrequency(average); // 사용자 주파수 상태 업데이트
      checkMatch(average, targetFrequency); // 주파수 일치 검사
      requestAnimationFrame(analyzeAudio); // 다음 애니메이션 프레임 요청
    };

    analyzeAudio(); // 오디오 분석 시작
    setIsListening(true); // 청취 상태 업데이트
  };

  // 음성 청취 중지 함수
  const stopListening = () => {
    audioContextRef.current?.close(); // AudioContext 종료
    microphoneRef.current = null; // 마이크로폰 소스 초기화
    setIsListening(false); // 청취 상태 업데이트
  };

  // 주파수 일치 검사
  const checkMatch = useCallback(
    (frequency: number, targetFrequency: number) => {
      const withinRange = Math.abs(frequency - targetFrequency) < 10; // 주파수 차이가 20Hz 이내인지 확인
      // 주파수에 따라 공의 높이를 설정 (주파수 비율을 이용하여 높이 조정)
      const heightPercentage = Math.min(
        Math.max((frequency / targetFrequency) * 100, 0),
        100
      );
      setBallHeight(heightPercentage); // 공의 높이를 계산하여 설정
      setIsMatched(withinRange); // 일치 여부 업데이트
    },
    [userFrequency] // userFrequency를 의존성 배열에 추가
  );

  // 평균 주파수 계산 함수
  const getAverageFrequency = (dataArray: Uint8Array) => {
    const sum = dataArray.reduce((acc, value) => acc + value, 0); // 배열의 합계 계산
    return sum / dataArray.length; // 평균 주파수 반환
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopListening(); // 언마운트 시 청취 중지
    };
  }, []);

  // 외부에서 사용할 수 있는 값 반환
  return {
    ballHeight, // 공의 높이
    isMatched, // 주파수 일치 여부
    isListening, // 청취 상태
    userFrequency, // 사용자 주파수
    startListening, // 청취 시작 함수
    stopListening, // 청취 중지 함수
  };
};

export default useVocal; // 훅을 다른 모듈에서 사용할 수 있도록 내보내기
