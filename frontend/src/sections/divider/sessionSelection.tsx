import { CheckboxGroup, Fieldset, Text } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";

interface SessionSelectionProps {
  selectedSessions: string[];
  setSelectedSessions: React.Dispatch<React.SetStateAction<string[]>>;
}

const sessions = [
  { label: "보컬", value: "vocals" },
  { label: "어쿠스틱 기타", value: "acoustic_guitar" },
  { label: "피아노", value: "piano" },
  { label: "일렉트릭 기타", value: "electric_guitar" },
  { label: "신시사이저", value: "synthesizer" },
  { label: "베이스", value: "bass" },
  { label: "드럼", value: "drum" },
];

export function SessionSelection({
  selectedSessions,
  setSelectedSessions,
}: SessionSelectionProps) {
  const handleCheckboxChange = (sessionValue: string, isChecked: boolean) => {
    setSelectedSessions((prevSessions) => {
      if (isChecked) return [...prevSessions, sessionValue];
      return prevSessions.filter((session) => session !== sessionValue);
    });
  };

  return (
    <Fieldset.Root>
      <CheckboxGroup
        defaultValue={["vocal"]}
        name="session"
        value={selectedSessions}
        background="rgba(0, 0, 0, 0.15)"
        border="2px solid rgba(90, 0, 170, 0.7)"
        borderRadius="10px"
        px="20px"
        py="20px"
        mb={2}
      >
        <Fieldset.Legend fontSize={15} color={"white"} fontWeight={"bold"}>
          세션 추출
        </Fieldset.Legend>
        <Fieldset.Legend fontSize={12} mb="3" color="rgba(255, 255, 255, 0.85)">
          추출할 세션 종류를 선택해주세요.
        </Fieldset.Legend>

        <Fieldset.Content
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gap={2}
        >
          {sessions.map((session) => (
            <Checkbox
              size={"sm"}
              key={session.value}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                handleCheckboxChange(session.value, target.checked);
                console.log("체크박스 이벤트 발생 :", session.value);
              }}
            >
              <Text fontSize="13px">{session.label}</Text>
            </Checkbox>
          ))}
        </Fieldset.Content>
      </CheckboxGroup>
    </Fieldset.Root>
  );
}
