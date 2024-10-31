import { useState, useEffect, useRef } from "react";
import sounds from "../../../utils/game/drumSound";

type SoundType = keyof typeof sounds;
type Message = string;

const useDrumGame = () => {
  const [currentBeat, setCurrentBeat] = useState<SoundType | null>(null);
  const [score, setScore] = useState<number>(0);
  const [pattern, setPattern] = useState<SoundType[]>([]);
  const [userPattern, setUserPattern] = useState<SoundType[]>([]);
  const [isPlayingPattern, setIsPlayingPattern] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>(" ");
  const [level, setLevel] = useState<number>(1);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  // 특정 소리를 재생하는 함수
  const playSound = (soundType: SoundType): void => {
    sounds[soundType].currentTime = 0;
    sounds[soundType].play();
    setCurrentBeat(soundType);
  };

  // 드럼 클릭 시 사용자 패턴을 업데이트하고 소리를 재생하는 함수
  const handleDrumClick = (drumType: SoundType): void => {
    if (isPlayingPattern) return;
    playSound(drumType);
    setUserPattern((prev) => [...prev, drumType]);
  };

  // 랜덤 패턴을 생성하는 함수
  const generateRandomPattern = (length: number): SoundType[] => {
    const drumTypes = Object.keys(sounds) as SoundType[];
    return Array.from(
      { length },
      () => drumTypes[Math.floor(Math.random() * drumTypes.length)]
    );
  };

  // 패턴을 재생하는 함수
  const playPattern = (pattern: SoundType[], level: number): void => {
    setUserPattern([]);
    setIsPlayingPattern(true);
    setMessage("잘 들어보세요 !");
    let delay = 0;
    const initialDelay = Math.max(800 - level * 100, 100);
    pattern.forEach((beat, index) => {
      const timerId = setTimeout(() => {
        playSound(beat);
        if (index === pattern.length - 1) {
          setTimeout(() => {
            setIsPlayingPattern(false);
            setMessage("이제 드럼을 따라 쳐보세요 !");
          }, 1000);
        }
      }, delay);
      timerRefs.current.push(timerId);
      delay += initialDelay;
    });
  };

  // 게임을 시작하고 패턴을 생성하는 함수
  const startPatternGame = (): void => {
    if (level > 9) {
      setMessage(`게임이 끝났습니다! ${correctCount * 10}점 입니다 ! `);
      setGameOver(true);
      return;
    }
    const newPattern = generateRandomPattern(level + 2);
    setPattern(newPattern);
    setUserPattern([]);
    setMessage("준비하세요!");
    setIsGameStarted(true);

    setTimeout(() => {
      setMessage("");
      playPattern(newPattern, level);
    }, 1000);
  };

  // 게임을 리셋하는 함수
  const resetGame = (): void => {
    setScore(0);
    setLevel(1);
    setCurrentBeat(null);
    setCorrectCount(0);
    setUserPattern([]);
    setMessage("");
    setPattern([]);
    setGameOver(false);
    setIsGameStarted(false);
    setIsPlayingPattern(false);

    Object.values(sounds).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });

    timerRefs.current.forEach((id) => clearTimeout(id));
    timerRefs.current = [];
  };

  // 사용자 패턴이 패턴과 일치하는지 확인하고 게임 상태를 업데이트하는 함수
  useEffect(() => {
    if (userPattern.length === pattern.length && pattern.length > 0) {
      const isCorrect = userPattern.every(
        (beat, index) => beat === pattern[index]
      );
      if (isCorrect) {
        setMessage("정답입니다!");
        setScore(score + 10);
        setCorrectCount(correctCount + 1);
        setLevel(level + 1);
        setCurrentBeat(null);
        setIsPlayingPattern(true);
      } else {
        setMessage("오답입니다! 다음 단계로 넘어갑니다.");
        setLevel(level + 1);
        setCurrentBeat(null);
        setIsPlayingPattern(true);
      }
      if (level >= 10) {
        setLevel(10);
        setMessage("게임이 끝났습니다!");
        setCurrentBeat(null);
        setGameOver(true);
      }
      setTimeout(() => {
        if (!gameOver) startPatternGame();
      }, 1000);
    }
  }, [userPattern]);

  // 컴포넌트 언마운트 시 게임을 리셋하는 함수
  useEffect(() => {
    return () => {
      resetGame();
    };
  }, []);

  return {
    currentBeat,
    score,
    pattern,
    userPattern,
    isPlayingPattern,
    message,
    level,
    correctCount,
    gameOver,
    isGameStarted,
    handleDrumClick,
    startPatternGame,
    resetGame,
    playPattern,
  };
};

export default useDrumGame;
