import { useState } from "react";
import { Button, Input, Stack } from "@chakra-ui/react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DividerButton() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [originTitle, setOriginTitle] = useState("");
  const [originSinger, setOriginSinger] = useState("");

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button
          size="md"
          variant="outline"
          fontFamily="MiceGothic"
          fontSize={14}
          width="150px"
          alignSelf="center"
        >
          세션 추출하기
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <PopoverTitle
            fontWeight="medium"
            fontFamily="MiceGothic"
            fontSize={13}
            marginBottom={3}
          >
            세션 추출하기
          </PopoverTitle>
          <Stack gap={2}>
            <Input
              placeholder="워크스페이스 이름을 입력해주세요."
              size="sm"
              fontFamily="MiceGothic"
              fontSize={11}
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <Input
              placeholder="작업할 곡의 원곡명을 입력해주세요."
              size="sm"
              fontFamily="MiceGothic"
              fontSize={11}
              value={originTitle}
              onChange={(e) => setOriginTitle(e.target.value)}
            />
            <Input
              placeholder="작업할 곡의 원곡자를 입력해주세요."
              size="sm"
              fontFamily="MiceGothic"
              fontSize={11}
              value={originSinger}
              onChange={(e) => setOriginSinger(e.target.value)}
            />
          </Stack>
          <Button
            size="sm"
            variant="outline"
            fontFamily="MiceGothic"
            fontSize={11}
            mt={4}
          >
            추출하기
          </Button>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}
