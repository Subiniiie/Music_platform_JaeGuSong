import { useEffect, useState } from "react";
import { Box, Button, Stack, Heading, Text, Flex } from "@chakra-ui/react";
import { Slider } from "@/components/ui/slider";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";

export default function WsDetailView() {
  const [waveformInstances, setWaveformInstances] = useState<WaveSurfer[]>([]);
  const [startPoint, setStartPoint] = useState(0);
  const [endPoint, setEndPoint] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const waveforms = [
    { id: "vocal", label: "Vocal", fileUrl: "/path/to/vocal.mp3" },
    { id: "guitar", label: "Guitar", fileUrl: "/path/to/guitar.mp3" },
    { id: "drum", label: "Drum", fileUrl: "/path/to/drum.mp3" },
  ];

  useEffect(() => {
    const instances = waveforms.map((track) => {
      const waveform = WaveSurfer.create({
        container: `#waveform-${track.id}`,
        waveColor: "#777",
        progressColor: "#FF0000",
        cursorColor: "#00FF00",
        height: 80,
        plugins: [
          RegionsPlugin.create(), // Regions 플러그인 추가
        ],
      });
      waveform.load(track.fileUrl);
      return waveform;
    });
    setWaveformInstances(instances);

    return () => instances.forEach((waveform) => waveform.destroy());
  }, []);

  const handlePlayPause = () => {
    waveformInstances.forEach((waveform) => waveform.playPause());
    setIsPlaying(!isPlaying);
  };

  const setStartPointMarker = () => {
    waveformInstances.forEach((waveform) =>
      (waveform as any).addRegion({
        start: startPoint,
        color: "rgba(0, 255, 0, 0.1)",
      })
    );
  };

  const setEndPointMarker = () => {
    waveformInstances.forEach((waveform) =>
      (waveform as any).addRegion({
        end: endPoint,
        color: "rgba(255, 0, 0, 0.1)",
      })
    );
  };

  return (
    <Stack padding={4} bg="purple.900" color="white" borderRadius="md">
      <Heading>현우 님의 워크스페이스</Heading>
      <Text>APT. _ EmptyWatermelon.mp3</Text>
      <Text fontSize="sm" color="gray.400">
        최종 저장일시: 2024-10-24 23:10
      </Text>

      {waveforms.map((track) => (
        <Box
          key={track.id}
          border="1px solid #333"
          borderRadius="md"
          padding={2}
          mb={4}
        >
          <Heading size="sm" mb={2}>
            {track.label}
          </Heading>
          <Box id={`waveform-${track.id}`} />
        </Box>
      ))}

      <Flex justify="space-around" mt={4}>
        <Button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button onClick={setStartPointMarker} colorScheme="green">
          시작지점 설정
        </Button>
        <Button onClick={setEndPointMarker} colorScheme="red">
          종료지점 설정
        </Button>
      </Flex>

      <Flex mt={4} align="center">
        <Text>Start Point:</Text>
        <Slider />
      </Flex>

      <Flex mt={4} align="center">
        <Text>End Point:</Text>
        <Slider />
      </Flex>
    </Stack>
  );
}
