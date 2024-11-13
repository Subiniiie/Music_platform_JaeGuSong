import { Stack, Text, Input } from "@chakra-ui/react";

interface WorkspaceInfoSectionProps {
  workspaceName: string;
  originTitle: string;
  originSinger: string;
  setWorkspaceName: (name: string) => void;
  setOriginTitle: (title: string) => void;
  setOriginSinger: (singer: string) => void;
}

export function WsInfoBox({
  workspaceName,
  originTitle,
  originSinger,
  setWorkspaceName,
  setOriginTitle,
  setOriginSinger,
}: WorkspaceInfoSectionProps) {
  return (
    <Stack
      gap={2}
      my={2}
      background="rgba(0, 0, 0, 0.15)"
      border="2px solid rgba(90, 0, 170, 0.7)"
      borderRadius="10px"
      px="20px"
      py="20px"
    >
      <Text fontSize={15} color="white" fontWeight="bold" mb="3">
        워크스페이스 정보
      </Text>
      <Input
        placeholder="워크스페이스 이름을 입력해주세요."
        size="sm"
        fontSize={11}
        background="white"
        color="black"
        value={workspaceName}
        onChange={(e) => setWorkspaceName(e.target.value)}
      />
      <Input
        placeholder="작업할 곡의 원곡명을 입력해주세요."
        size="sm"
        fontSize={11}
        background="white"
        color="black"
        value={originTitle}
        onChange={(e) => setOriginTitle(e.target.value)}
      />
      <Input
        placeholder="작업할 곡의 원곡자를 입력해주세요."
        size="sm"
        fontSize={11}
        background="white"
        color="black"
        value={originSinger}
        onChange={(e) => setOriginSinger(e.target.value)}
      />
    </Stack>
  );
}
