import { Stack, createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  // SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

export default function ToggleOptions() {
  return (
    <Stack gap="5" width="180px">
      {/* ["xs", "sm", "md", "lg"] */}
      <SelectRoot key={"xs"} size={"xs"} collection={frameworks}>
        {/* <SelectLabel>size = {"xs"}</SelectLabel> */}
        <SelectTrigger>
          <SelectValueText
            fontFamily="MiceGothic"
            fontSize={11}
            placeholder="세션을 선택해주세요"
          />
        </SelectTrigger>
        <SelectContent>
          {frameworks.items.map((movie) => (
            <SelectItem
              fontFamily="MiceGothic"
              fontSize={10}
              item={movie}
              key={movie.value}
            >
              {movie.label}
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
    { label: "건반", value: "piano" },
    { label: "기타", value: "guitar" },
    { label: "베이스", value: "base" },
    { label: "드럼", value: "drum" },
    { label: "etc.", value: "etc." },
  ],
});
