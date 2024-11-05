import React, { useEffect, useState, useRef } from "react";
import { Text, Box } from "@chakra-ui/react";
import CustomButton from "@/components/common/Button";

const VocalGame: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [userFrequency, setUserFrequency] = useState(0);
  const [previousFrequency, setPreviousFrequency] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [obstacles, setObstacles] = useState<any[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [ballPosition, setBallPosition] = useState(600);
  const [lives, setLives] = useState(3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

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
      if (!gameOver) {
        // 게임 종료 시 분석 중지
        analyserRef.current?.getByteFrequencyData(dataArray);
        const averageFrequency = getAverageFrequency(dataArray);
        setUserFrequency(averageFrequency);
        requestAnimationFrame(analyzeAudio);
      }
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
    const average = sum / dataArray.length;
    return (average / 255) * 1000;
  };

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

  useEffect(() => {
    if (isListening && !gameOver) {
      const spawnObstacle = () => {
        const position = Math.random() * 1200;
        setObstacles((prev) => [...prev, { position, height: 600 }]);
      };

      const spawnInterval = setInterval(
        spawnObstacle,
        Math.random() * 1000 + 1000
      );

      return () => clearInterval(spawnInterval);
    }
  }, [isListening, gameOver]);

  useEffect(() => {
    const fallInterval = setInterval(() => {
      if (!gameOver) {
        setObstacles((prev) => {
          return prev
            .map((obstacle) => ({
              ...obstacle,
              height: obstacle.height - 5,
            }))
            .filter((obstacle) => obstacle.height > 0);
        });
      }
    }, 100);

    return () => clearInterval(fallInterval);
  }, [obstacles, gameOver]);

  const toggleListening = () => {
    if (gameOver) {
      resetGame(); // 게임 종료 후 다시 시작 시 초기화
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

  const resetGame = () => {
    setGameOver(false);
    setTimeRemaining(30);
    setObstacles([]);
    setBallPosition(600);
    setLives(3);
    setPreviousFrequency(0);
    setUserFrequency(0);
    setIsListening(false);
    startListening();
  };

  const checkCollision = () => {
    obstacles.forEach((obstacle) => {
      if (
        obstacle.height > 10 && // 장애물이 바닥 근처에 있을 때
        Math.abs(ballPosition - obstacle.position) < 10 // 공과 장애물 간의 충돌 체크
      ) {
        setLives((prev) => prev - 1); // 생명 하나 감소
        if (lives <= 1) {
          setGameOver(true); // 생명이 0이 되면 게임 오버
          stopListening();
        }
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(checkCollision, 100);
    return () => clearInterval(interval);
  }, [obstacles, ballPosition, lives, gameOver]);

  useEffect(() => {
    if (userFrequency) {
      const centerFrequency = 100; // 기준 주파수
      const moveMultiplier = 1; // 적당한 이동 배율을 설정하여 반응 속도를 개선

      let moveDistance = 0;
      if (userFrequency > centerFrequency) {
        moveDistance = (userFrequency - centerFrequency) * moveMultiplier;
      } else if (userFrequency < centerFrequency) {
        moveDistance = -(centerFrequency - userFrequency) * moveMultiplier;
      }

      // 이동 거리를 제한하여 공이 천천히 움직이도록 설정
      moveDistance = Math.max(Math.min(moveDistance, 10), -10); // -10에서 10까지 제한

      const newPosition = ballPosition + moveDistance;

      // 화면을 벗어나지 않도록 ballPosition의 범위를 0~1200으로 제한
      setBallPosition(Math.min(Math.max(newPosition, 0), 1200));
    }
  }, [userFrequency]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop="60px"
      color="white"
      padding="20px"
      fontFamily="OneMobile"
      bgGradient="linear(to-b, #4b6cb7, #182848)"
      borderRadius="20px"
      boxShadow="0px 4px 20px rgba(0, 0, 0, 0.3)"
      position="relative"
      height="600px"
      overflow="hidden"
    >
      <Text fontSize="72px" textAlign="center" color="#f0aaff">
        벽돌 피하기 게임
      </Text>

      <Text fontSize="28px" color="white">
        남은 시간: {timeRemaining}초
      </Text>

      <Text fontSize="28px" color="white">
        현재 주파수: {userFrequency.toFixed(2)}Hz
      </Text>

      <Text fontSize="28px" color="white">
        생명: {lives}개
      </Text>

      <Box
        position="absolute"
        bottom="50px"
        left={`${ballPosition}px`}
        width="30px"
        height="30px"
        backgroundColor="blue.400"
        borderRadius="full"
        transition="left 0.1s ease"
      />

      {obstacles.map((obstacle, index) => (
        <Box
          key={index}
          position="absolute"
          bottom={`${obstacle.height}px`}
          left={`${obstacle.position}px`}
          width="50px"
          height="50px"
          backgroundColor="red.500"
          borderRadius="5px"
        />
      ))}

      <CustomButton onClick={toggleListening}>
        {gameOver ? "다시 시작하기" : isListening ? "중지" : "시작"}
      </CustomButton>

      {gameOver && (
        <Text fontSize="28px" color="red">
          {lives <= 0
            ? "게임 오버! 생명이 모두 소진되었습니다."
            : "게임 클리어 !"}
        </Text>
      )}
    </Box>
  );
};

export default VocalGame;
