import { Stack, createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

export default function ToggleOptions({ onSelectSession }) {

  return (
    <Stack gap="5" width="180px">
      <SelectRoot key={"xs"} size={"xs"} collection={frameworks}>
        <SelectTrigger background={"white"} borderRadius={5}>
          <SelectValueText
            fontFamily="MiceGothic"
            fontSize={11}
            color={"black"}
            placeholder="세션을 선택해주세요"
          />
        </SelectTrigger>
        <SelectContent>
          {frameworks.items.map((session) => (
            <SelectItem
              fontFamily="MiceGothic"
              fontSize={10}
              item={session}
              key={session.value}
              onClick={() => onSelectSession(session.label)}
            >
              {session.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Stack>
  );
}

const frameworks = createListCollection({
  items: [
    { label: "VOCAL", value: "vocal" },
    { label: "PIANO", value: "piano" },
    { label: "SYNTHESIZER", value: "synthesizer" },
    { label: "ACOUSTIC GUITAR", value: "acoustic_guitar" },
    { label: "ELECTRIC GUITAR", value: "electric_guitar" },
    { label: "BASS", value: "bass" },
    { label: "DRUM", value: "drum" },
    // { label: "etc.", value: "etc." },
  ],
});
