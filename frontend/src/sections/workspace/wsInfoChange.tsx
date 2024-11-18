import { useState } from "react";
import axios from "axios";
import { Button, Input, Stack, Text, IconButton } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LuPencilLine } from "react-icons/lu";

export default function WsInfoChange({ artistSeq, onWorkspaceCreated }) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [originTitle, setOriginTitle] = useState("");
  const [originSinger, setOriginSinger] = useState("");
  const [errors, setErrors] = useState({
    workspaceName: "",
    originTitle: "",
    originSinger: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;

  const handleCreateWorkspace = async () => {
    // 필드별 유효성 검사
    let hasError = false;
    const newErrors = { workspaceName: "", originTitle: "", originSinger: "" };

    if (!workspaceName.trim()) {
      newErrors.workspaceName = "새로운 워크스페이스 이름을 입력해주세요.";
      hasError = true;
    }
    if (!originTitle.trim()) {
      newErrors.originTitle = "새로운 원곡명을 입력해주세요.";
      hasError = true;
    }
    if (!originSinger.trim()) {
      newErrors.originSinger = "새로운 원곡자를 입력해주세요.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const storedToken = localStorage.getItem("jwtToken");
      const response = await axios.post(
        // `${API_URL}/api/artists/${artistSeq}/workspaces`,
        `${API_URL}/api/workspaces`,
        {
          name: workspaceName,
          originSinger,
          originTitle,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      toaster.create({
        description: "워크스페이스가 성공적으로 생성되었습니다.",
        type: "success",
      });

      onWorkspaceCreated(response.data);
    } catch (error) {
      console.error("Error creating workspace:", error);
      toaster.create({
        description: "워크스페이스 생성에 실패했습니다.",
        type: "error",
      });
    }
  };

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <IconButton
          ml={2}
          rounded="full"
          bg="transparent"
          color="white"
        >
          <LuPencilLine />
        </IconButton>
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
              onChange={(e) => {
                setWorkspaceName(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  workspaceName: "",
                }));
              }}
            />
            {errors.workspaceName && (
              <Text color="red.500" fontSize="xs">
                {errors.workspaceName}
              </Text>
            )}

            <Input
              placeholder="작업할 곡의 원곡명을 입력해주세요."
              size="sm"
              fontFamily="MiceGothic"
              fontSize={11}
              value={originTitle}
              onChange={(e) => {
                setOriginTitle(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, originTitle: "" }));
              }}
            />
            {errors.originTitle && (
              <Text color="red.500" fontSize="xs">
                {errors.originTitle}
              </Text>
            )}

            <Input
              placeholder="작업할 곡의 원곡자를 입력해주세요."
              size="sm"
              fontFamily="MiceGothic"
              fontSize={11}
              value={originSinger}
              onChange={(e) => {
                setOriginSinger(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  originSinger: "",
                }));
              }}
            />
            {errors.originSinger && (
              <Text color="red.500" fontSize="xs">
                {errors.originSinger}
              </Text>
            )}
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
  );
}
