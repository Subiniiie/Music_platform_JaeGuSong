import { useState, useEffect } from "react";
import { NOTES } from "../../../utils/game/vocalSound";

export const useVocalGame = (isMatched: boolean) => {
  const [level, setLevel] = useState<number>(0);
  console.log(level);
  const [targetPitch, setTargetPitch] = useState<number>(NOTES[0]);
  const [message, setMessage] = useState<string>("시작하려면 마이크를 켜세요");
  const [gameOver, setGameOver] = useState<boolean>(false);

  // isMatched가 변경될 때마다 다음 레벨로 진행
  useEffect(() => {
    if (isMatched) {
      handleNextLevel();
    }
  }, [isMatched]);

  // 다음 레벨로 진행
  const handleNextLevel = () => {
    if (level < NOTES.length - 1) {
      setLevel((prev) => prev + 1);
      setTargetPitch(NOTES[level + 1]);
      setMessage("");
    } else {
      setGameOver(true);
      setMessage("게임 클리어! ");
    }
  };

  // 게임 초기화
  const resetGame = () => {
    setLevel(0);
    setTargetPitch(NOTES[0]);
    setMessage("");
    setGameOver(false);
  };

  return {
    level,
    targetPitch,
    message,
    gameOver,
    handleNextLevel,
    resetGame,
  };
};
