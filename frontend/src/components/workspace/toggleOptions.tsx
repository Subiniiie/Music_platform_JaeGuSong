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
              onClick={() => onSelectSession(session.value)}
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
    { label: "보컬", value: "vocal" },
    { label: "피아노", value: "piano" },
    { label: "신시사이저", value: "synthesizer" },
    { label: "어쿠스틱 기타", value: "acoustic_guitar" },
    { label: "일렉트릭 기타", value: "electric_guitar" },
    { label: "베이스", value: "bass" },
    { label: "드럼", value: "drum" },
    // { label: "etc.", value: "etc." },
  ],
});
