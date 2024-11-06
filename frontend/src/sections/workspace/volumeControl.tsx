import { Slider } from "@/components/ui/slider";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export default function VolumeControl({
  volume,
  onVolumeChange,
}: VolumeControlProps) {
  return (
    <Slider
      maxW="200px"
      value={[volume]} // 배열 형태로 제공
      onValueChange={(e: { value: number[] }) => onVolumeChange(e.value[0])} // ValueChangeDetails 구조
    />
  );
}
