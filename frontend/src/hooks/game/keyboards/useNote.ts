import { useState, useEffect } from "react";
import * as Tone from "tone";
import { notes } from "@/utils/game/keyboardsSound";

// 타입 정의
type Note = string | null; // 음은 문자열 또는 null
type Octave = string | null; // 옥타브는 문자열 또는 null
type Message = string; // 피드백 메시지 타입
type Options = Note[]; // 선택지는 Note 배열

const useNote = () => {
  const [octave, setOctave] = useState<Octave>(null); // 선택된 옥타브
  const [note, setNote] = useState<Note>(null); // 현재 정답 음
  const [options, setOptions] = useState<Options>([]); // 선택지
  const [message, setMessage] = useState<Message>(""); // 피드백 메시지
  const [level, setLevel] = useState<number>(1); // 현재 레벨
  const [correctCount, setCorrectCount] = useState<number>(0); // 정답 수 카운트
  const [gameOver, setGameOver] = useState<boolean>(false); // 게임 종료 여부
  const [isAnswered, setIsAnswered] = useState<boolean>(false); // 현재 문제의 답변 여부
  const [octaveSelected, setOctaveSelected] = useState<boolean>(false); // 옥타브 선택 여부
  const [hasPlayedNote, setHasPlayedNote] = useState<boolean>(false); // 음이 재생되었는지 여부
  const [isDisabled, setIsDisabled] = useState<boolean>(true); // 선택지 비활성화

  // 음을 재생하는 함수
  const playNote = async (note: Note) => {
    if (note) {
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease(note, "8n");
      setHasPlayedNote(true);
    }
  };

  // 음 재생 요청 함수 - 버튼 클릭 시 실행됨
  const playRandomNote = (note: Note) => {
    if (note) {
      playNote(note);
      setHasPlayedNote(true);
      setIsDisabled(false);
    }
  };

  // 옥타브 선택 시 호출되는 함수
  const selectOctave = (oct: Octave) => {
    setOctave(oct);
    setOctaveSelected(true);
    generateNewQuestion();
  };

  // 새로운 문제를 생성하는 함수 (랜덤한 음과 선택지를 설정)
  const generateNewQuestion = () => {
    if (!octave) {
      setMessage("먼저 옥타브를 선택하세요!");
      return;
    }
    const selectedNotes = notes[octave]; // octave가 null이 아닌지 확인 후 사용
    if (!selectedNotes) {
      setMessage("잘못된 옥타브입니다!");
      return;
    }
    const randomNote =
      selectedNotes[Math.floor(Math.random() * selectedNotes.length)];
    setNote(randomNote);
    setOptions(generateOptions(randomNote));
    setIsAnswered(false);
    setHasPlayedNote(false);
    setIsDisabled(true);
    setMessage("음 듣기를 눌러 음을 들어주세요 !");
  };

  useEffect(() => {
    if (octave) {
      generateNewQuestion();
    }
  }, [octave]);

  // 선택지 3가지를 랜덤으로 생성하여 리턴하는 함수
  const generateOptions = (correct: Note) => {
    let randomOptions = notes[octave!].filter((n) => n !== correct); // non-null assertion 사용
    randomOptions = randomOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...randomOptions, correct].sort(() => 0.5 - Math.random());
  };

  // 사용자의 선택이 정답인지 확인하고 피드백을 제공하는 함수
  const checkNoteAnswer = (selectedOption: Note) => {
    if (isAnswered) return;

    if (!hasPlayedNote) {
      setMessage("먼저 음을 들어야 합니다 !");
      return;
    }

    if (level >= 10) {
      setMessage(`게임이 끝났습니다! ${correctCount * 10}점 입니다 !`);
      setGameOver(true);
      return;
    }

    if (selectedOption === note) {
      setMessage("정답입니다!");
      setCorrectCount((prev) => prev + 1);
    } else {
      setMessage(`오답입니다! 정답은 ${note} 입니다.`);
    }

    setIsAnswered(true);
  };

  // 다음 문제로 넘어가는 함수
  const handleNextLevel = () => {
    setLevel((prev) => Math.min(prev + 1, 10));
    setIsAnswered(false);
    setMessage("");
    generateNewQuestion();
  };

  // 게임을 초기 상태로 리셋하는 함수
  const resetGame = () => {
    setLevel(1);
    setCorrectCount(0);
    setMessage("");
    setGameOver(false);
    setIsAnswered(false);
    setHasPlayedNote(false);
    setNote(null);
    setIsDisabled(true);
    setOctaveSelected(false);
    setOctave(null);
    generateNewQuestion();
  };

  return {
    note,
    octave,
    selectOctave,
    options,
    message,
    playNote,
    checkNoteAnswer,
    level,
    correctCount,
    gameOver,
    resetGame,
    handleNextLevel,
    octaveSelected,
    isAnswered,
    isDisabled,
    playRandomNote,
    hasPlayedNote,
  };
};

export default useNote;
