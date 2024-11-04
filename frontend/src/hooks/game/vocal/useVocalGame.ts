import { useState } from "react";
import { NOTES } from "../../../utils/game/vocalSound";

const LEVEL_TARGET_PITCHES = [
  "C4",
  "D4",
  "E4",
  "F4",
  "G4",
  "A4",
  "B4",
  "C5",
  "D5",
  "E5",
];

export const useVocalGame = () => {
  const [level, setLevel] = useState<number>(1);
  const [targetPitch, setTargetPitch] = useState<string>("C4");
  const [message, setMessage] = useState<string>("시작하려면 마이크를 켜세요");
  const [gameOver, setGameOver] = useState<boolean>(false);
  console.log(gameOver);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);

  const targetFrequency: number =
    440 * Math.pow(2, (NOTES.indexOf(targetPitch.slice(0, -1)) - 9) / 12);

  const nextLevel = () => {
    const newLevel = level + 1;
    if (newLevel > LEVEL_TARGET_PITCHES.length) {
      setGameOver(true);
      setMessage("게임 종료! 다시 시작하려면 버튼을 눌러주세요.");
      return;
    }
    setLevel(newLevel);
    setTargetPitch(LEVEL_TARGET_PITCHES[newLevel - 1]);
    setMessage("발성 대기 중...");
  };

  const resetGame = () => {
    setLevel(1);
    setTargetPitch(LEVEL_TARGET_PITCHES[0]);
    setMessage("시작하려면 마이크를 켜세요");
    setGameOver(false);
    setIsMicActive(false);
  };

  const handleMicToggle = () => {
    if (gameOver) {
      resetGame();
    } else {
      setIsMicActive((prev) => {
        const newMicActive = !prev;
        if (newMicActive) {
          setLevel(1);
          setMessage("마이크가 활성화되었습니다. 발성하세요");
          setTargetPitch(LEVEL_TARGET_PITCHES[0]);
        } else {
          setMessage("마이크가 비활성화되었습니다.");
        }
        return newMicActive;
      });
    }
  };

  return {
    level,
    targetPitch,
    message,
    gameOver,
    isMicActive,
    targetFrequency,
    nextLevel,
    resetGame,
    handleMicToggle,
  };
};
