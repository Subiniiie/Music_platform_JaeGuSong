// ControlPanel.tsx
import { Stack, IconButton, Box } from "@chakra-ui/react";

const PlayIcon = (props) => (
  <Box as="svg" viewBox="0 0 24 24" {...props}>
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </Box>
);

const PauseIcon = (props) => (
  <Box as="svg" viewBox="0 0 24 24" {...props}>
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor" />
  </Box>
);

const StopIcon = (props) => (
  <Box as="svg" viewBox="0 0 24 24" {...props}>
    <path d="M6 6h12v12H6z" fill="currentColor" />
  </Box>
);

export default function ControlPanel({ isPlaying, onPlayPause, onStop }) {
  return (
    <Stack direction="row" align="center">
      <IconButton
        onClick={onPlayPause}
        colorScheme="teal"
        size="sm"
        aria-label={isPlaying ? "일시정지" : "재생"}
        icon={isPlaying ? <PauseIcon boxSize={5} /> : <PlayIcon boxSize={5} />}
      />
      <IconButton
        onClick={onStop}
        colorScheme="red"
        size="sm"
        aria-label="정지"
        icon={<StopIcon boxSize={5} />}
      />
    </Stack>
  );
}
