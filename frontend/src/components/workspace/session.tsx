import { Box, Stack, Text, Button } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

export default function Session() {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    // WaveSurfer 인스턴스 생성
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#FFFFFF", // 파형 색상
      progressColor: "#FFFFFF", // 진행된 파형 색상
      cursorColor: "green", // 재생 위치 바 색상
      barWidth: 1,
      barHeight: 0.8,
      height: 100,
    });

    // 오디오 파일 로드
    wavesurferRef.current.load("/DAY6 - Welcome to the Show.mp3");

    // 컴포넌트 언마운트 시 WaveSurfer 인스턴스 해체
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  // 재생/일시정지 함수
  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <Stack>
      <Stack direction="row" align="center" spacing={2}>
        <Box />
        <Text fontFamily="MiceGothic">Vocal</Text>
        <Button onClick={handlePlayPause} colorScheme="teal" size="sm">
          재생/일시정지
        </Button>
      </Stack>

      {/* 파형 시각화 */}
      <Box ref={waveformRef} width="100%" height="100px" />
    </Stack>
  );
}
