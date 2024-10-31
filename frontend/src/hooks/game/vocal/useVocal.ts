import { useState, useEffect } from "react";
import PitchFinder from "pitchfinder";
import {
  initMicrophone,
  stopMicrophone,
  convertToNote,
} from "../../../utils/game/vocalSound";

const useVocalGame = (targetNote: string) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [microphone, setMicrophone] =
    useState<MediaStreamAudioSourceNode | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [message, setMessage] = useState<string>("음성을 입력하세요");
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  let interval: NodeJS.Timeout | null = null;

  const analyzePitch = () => {
    if (analyser) {
      const detectPitch = new PitchFinder.YIN();
      const buffer = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buffer);

      const pitch = detectPitch.findPitch(buffer);
      if (pitch) {
        const note = convertToNote(pitch);
        setCurrentNote(note);
        checkAnswer(note);
      }
    }
  };

  const checkAnswer = (note: string) => {
    if (note === targetNote) {
      setMessage("Perfect!");
    } else if (note < targetNote) {
      setMessage("더 높게!");
    } else {
      setMessage("더 낮게!");
    }
  };

  const startGame = async () => {
    if (!isGameActive) {
      setMessage("음성을 입력하세요...");
      const { audioCtx, micSource, analyserNode } = await initMicrophone();
      setAudioContext(audioCtx);
      setMicrophone(micSource);
      setAnalyser(analyserNode);
      setIsGameActive(true);
      interval = setInterval(analyzePitch, 100);
    } else {
      setIsGameActive(false);
      setMessage("게임 종료");
      setCurrentNote(null);
      stopMicrophone(audioContext, microphone);
      if (interval) {
        clearInterval(interval);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioContext) {
        stopMicrophone(audioContext, microphone);
        if (interval) {
          clearInterval(interval);
        }
      }
    };
  }, [audioContext, microphone]);

  return {
    message,
    currentNote,
    isGameActive,
    startGame,
  };
};

export default useVocalGame;
