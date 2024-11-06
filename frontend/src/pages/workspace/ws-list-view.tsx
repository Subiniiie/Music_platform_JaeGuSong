import { Stack, Flex, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // react-router-dom에서 useNavigate 가져오기
import Filter from "@/sections/workspace/filter";
import Search from "@/sections/workspace/search";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toaster } from "@/components/ui/toaster";
import CardList from "@/sections/workspace/cardList";

export default function WsListView() {
  const navigate = useNavigate();
  const [workspaceName, setWorkspaceName] = useState("");
  const [originTitle, setOriginTitle] = useState("");
  const [originSinger, setOriginSinger] = useState("");

  const handleCreateWorkspace = async () => {
    try {
      const response = await fetch(
        "http://k11e106.p.ssafy.io/api/artists/{artistSeq}/workspaces",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: workspaceName,
            originTitle,
            originSinger,
          }),
        }
      );

      if (response.ok) {
        toaster.create({
          description: "워크스페이스가 성공적으로 생성되었습니다.",
          type: "success",
        });
        navigate("/workspace-detail"); // 원하는 경로로 이동
      } else {
        toaster.create({
          description: "워크스페이스 생성에 실패했습니다.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      toaster.create({
        description: "워크스페이스 생성에 실패했습니다.",
        type: "error",
      });
    }
  };

  return (
    <Stack>
      <Flex justify="space-between" align="center">
        <Flex gap={2}>
          <Filter />
          <Search />
        </Flex>

        <PopoverRoot>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              fontFamily="MiceGothic"
              fontSize={13}
            >
              워크스페이스 생성
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
                워크스페이스 생성
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
                onClick={handleCreateWorkspace}
              >
                생성하기
              </Button>
            </PopoverBody>
          </PopoverContent>
        </PopoverRoot>
      </Flex>
      <CardList />
    </Stack>
  );
}
