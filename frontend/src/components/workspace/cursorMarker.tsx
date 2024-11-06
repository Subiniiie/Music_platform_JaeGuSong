// CursorMarker.tsx
import { Box } from "@chakra-ui/react";

interface CursorMarkerProps {
  position: number;
  color: string;
  duration: number;
}

export default function CursorMarker({
  position,
  color,
  duration,
}: CursorMarkerProps) {
  return (
    <Box
      position="absolute"
      left={`${(position / duration) * 100}%`}
      bottom="100%"
      transform="translateX(-50%)"
      width="0"
      height="0"
      borderLeft="8px solid transparent"
      borderRight="8px solid transparent"
      borderTop={`8px solid ${color}`}
      cursor="pointer"
    />
  );
}
