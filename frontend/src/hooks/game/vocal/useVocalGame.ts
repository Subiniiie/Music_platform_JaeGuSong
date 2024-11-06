import { useEffect, useState, useRef } from "react";

const useVocalGame = () => {
  const [isListening, setIsListening] = useState(false); // 마이크 상태 (듣기 중 여부)
  const [userFrequency, setUserFrequency] = useState(600); // 사용자의 현재 주파수 (공 위치)
  const [gameOver, setGameOver] = useState(false); // 게임 종료 여부
  const [obstacles, setObstacles] = useState<any[]>([]); // 장애물 목록
  const [timeRemaining, setTimeRemaining] = useState(30); // 남은 시간
  const [lives, setLives] = useState(1); // 남은 생명 수

  // 오디오 처리와 관련된 Ref
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const frequencyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkCollisionLoopId = useRef<number | null>(null);

  // 마이크를 통해 사용자의 주파수를 읽고 게임 상태에 반영하는 함수
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

    // 500ms 간격으로 주파수를 분석하여 userFrequency에 설정
    frequencyIntervalRef.current = setInterval(() => {
      if (!gameOver) {
        analyserRef.current?.getByteFrequencyData(dataArray);
        const averageFrequency = getAverageFrequency(dataArray);
        setUserFrequency(averageFrequency);
      }
    }, 500);

    setIsListening(true);
  };

  // 마이크 듣기를 중단하는 함수
  const stopListening = () => {
    if (
      audioContextRef.current &&
      audioContextRef.current.state === "running"
    ) {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
        microphoneRef.current = null;
        setIsListening(false);
      });
    }
    if (frequencyIntervalRef.current) {
      clearInterval(frequencyIntervalRef.current);
      frequencyIntervalRef.current = null;
    }
  };

  // 주파수 데이터 배열에서 평균 주파수를 계산하여 0~1200Hz 범위로 매핑
  const getAverageFrequency = (dataArray: Uint8Array) => {
    const sum = dataArray.reduce((acc, value) => acc + value, 0);
    const average = sum / dataArray.length;
    return (average / 255) * 1200;
  };

  // 게임 시작/중지 또는 초기화 함수 (게임 오버 시 초기화)
  const toggleListening = () => {
    if (gameOver) {
      resetGame();
    } else {
      setIsListening((prev) => !prev);
      if (!isListening) {
        setGameOver(false);
        startListening();
      } else {
        stopListening();
      }
    }
  };

  // 게임을 초기 상태로 되돌리는 함수
  const resetGame = () => {
    if (frequencyIntervalRef.current) {
      clearInterval(frequencyIntervalRef.current);
      frequencyIntervalRef.current = null;
    }
    cancelAnimationFrame(checkCollisionLoopId.current);

    setGameOver(false);
    setTimeRemaining(30);
    setObstacles([]);
    setLives(1);
    setUserFrequency(600);
    setIsListening(false);
  };

  // 장애물과의 충돌을 확인하고 생명을 감소시키는 함수
  const checkCollision = () => {
    obstacles.forEach((obstacle) => {
      if (
        obstacle.height <= 30 &&
        Math.abs(obstacle.position - userFrequency) < 30
      ) {
        setObstacles((prev) => prev.filter((obs) => obs !== obstacle));

        setLives((prevLives) => {
          const newLives = prevLives - 1;
          if (newLives <= 0) {
            setGameOver(true);
            stopListening();
          }
          return newLives;
        });
      }
    });
  };

  // 지속적인 충돌 감지 루프 함수
  const checkCollisionLoop = () => {
    checkCollision();
    if (!gameOver) {
      checkCollisionLoopId.current = requestAnimationFrame(checkCollisionLoop);
    }
  };

  // 남은 시간을 1초씩 감소시키고 시간이 다 되면 게임 종료
  useEffect(() => {
    if (isListening && !gameOver) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            stopListening();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isListening, gameOver]);

  // 장애물 생성 함수, 장애물을 400~800ms 간격으로 생성
  useEffect(() => {
    if (isListening && !gameOver) {
      const spawnObstacle = () => {
        const position = Math.random() * 1200;
        setObstacles((prev) => [...prev, { position, height: 600 }]);
      };

      const spawnInterval = setInterval(
        spawnObstacle,
        Math.random() * 400 + 400
      );

      return () => clearInterval(spawnInterval);
    }
  }, [isListening, gameOver]);

  // 장애물이 아래로 떨어지도록 높이를 감소시키는 함수
  useEffect(() => {
    const fallInterval = setInterval(() => {
      if (!gameOver) {
        setObstacles((prev) => {
          return prev
            .map((obstacle) => ({
              ...obstacle,
              height: obstacle.height - 10,
            }))
            .filter((obstacle) => obstacle.height > 0);
        });
      }
    }, 50);

    return () => clearInterval(fallInterval);
  }, [obstacles, gameOver]);

  // 충돌 감지 루프 실행
  useEffect(() => {
    if (isListening && !gameOver) {
      checkCollisionLoop();
    }
  }, [isListening, gameOver, obstacles, userFrequency]);

  return {
    isListening,
    userFrequency,
    gameOver,
    obstacles,
    timeRemaining,
    lives,
    toggleListening,
    resetGame,
  };
};

export default useVocalGame;
