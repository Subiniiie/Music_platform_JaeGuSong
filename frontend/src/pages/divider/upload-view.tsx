import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  createListCollection,
  CheckboxGroup,
  Fieldset,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";
import axios from "axios";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-button";
import { HiUpload } from "react-icons/hi";
import { Checkbox } from "@/components/ui/checkbox";
import { toaster } from "@/components/ui/toaster";

export default function DividerUploadView() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [originTitle, setOriginTitle] = useState("");
  const [originSinger, setOriginSinger] = useState("");
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]); // 세션 선택 상태

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [files, setFiles] = useState<File | null>(null);

  type FileChangeEvent = {
    acceptedFiles: File[];
  };

  const handleFileChange = (event: FileChangeEvent) => {
    setFiles(event.acceptedFiles[0]); // files 배열을 setFiles로 전달
  };

  const handleDividerUpload = async () => {
    console.log(
      "안녕, 난 handleDividerUpload. 디바이더 업로드 api 요청 보내볼게"
    );
    if (!files) {
      toaster.error({
        title: "No files selected",
        description: "Please upload files before submitting.",
      });
      return;
    }

    // JSON 데이터를 객체 형태로 준비
    const workspaceRequest = {
      name: workspaceName,
      originSinger: originSinger,
      originTitle: originTitle,
    };

    const formData = new FormData();
    formData.append(
      "workspaceRequest",
      new Blob([JSON.stringify(workspaceRequest)], { type: "application/json" })
    );

    formData.append("file", files);
    formData.append(
      "stemList",
      new Blob([JSON.stringify(selectedSessions)], { type: "application/json" })
    );

    try {
      const storedToken = localStorage.getItem("jwtToken");
      await axios.post(`${API_URL}/api/workspace/divide`, formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      navigate(paths.divider.announcement);
    } catch (error) {
      console.error("Error adding session:", error);
      toaster.error({
        description: "디바이더 업로드에 실패했습니다.",
        type: "error",
      });
    }
  };

  const handleCheckboxChange = (sessionValue: string, isChecked: boolean) => {
    setSelectedSessions((prevSessions) => {
      if (isChecked) {
        return [...prevSessions, sessionValue]; // 체크된 항목 추가
      } else {
        return prevSessions.filter((session) => session !== sessionValue); // 체크 해제된 항목 제거
      }
    });
  };

  return (
    <Box
      width="100%"
      height="100%"
      alignContent="center"
      justifyItems="center"
      fontFamily="MiceGothic"
      color="white"
    >
      <Stack width="450px">
        <Stack
          gap={2}
          my={2}
          background="rgba(0, 0, 0, 0.15)"
          border="2px solid rgba(90, 0, 170, 0.7)"
          borderRadius="10px"
          px="20px"
          py="20px"
        >
          <Text fontSize={15} color={"white"} fontWeight={"bold"} mb="3">
            워크스페이스 정보
          </Text>
          <Input
            placeholder="워크스페이스 이름을 입력해주세요."
            size="sm"
            fontSize={11}
            background={"white"}
            color={"black"}
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
          <Input
            placeholder="작업할 곡의 원곡명을 입력해주세요."
            size="sm"
            fontSize={11}
            background={"white"}
            color={"black"}
            value={originTitle}
            onChange={(e) => setOriginTitle(e.target.value)}
          />
          <Input
            placeholder="작업할 곡의 원곡자를 입력해주세요."
            size="sm"
            fontSize={11}
            background={"white"}
            color={"black"}
            value={originSinger}
            onChange={(e) => setOriginSinger(e.target.value)}
          />
        </Stack>

        {/* 세션 다중 선택 */}
        <Fieldset.Root>
          <CheckboxGroup
            defaultValue={["vocal"]}
            name="framework"
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
            <Fieldset.Legend
              fontSize={12}
              mb="3"
              color="rgba(255, 255, 255, 0.85)"
            >
              추출할 세션 종류를 선택해주세요.
            </Fieldset.Legend>

            <Fieldset.Content
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              gap={2}
            >
              {frameworks.items.map((session) => (
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

        <Stack
          border="2px solid rgba(90, 0, 170, 0.7)"
          borderRadius="10px"
          px="20px"
          py="20px"
          mb="15px"
        >
          <Text fontSize={15} color={"white"} fontWeight={"bold"} mb="3">
            파일 업로드
          </Text>

          {/* 파일 업로드 */}
          <FileUploadRoot
            accept={["audio/*", "video/*"]}
            onFileChange={handleFileChange}
          >
            <FileUploadTrigger asChild>
              <Button
                variant="outline"
                // size="sm"
                width="100%"
                height="100px"
                color="white"
                background="rgba(255, 255, 255, 0.05)"
                border="2px solid rgba(255, 255, 255, 0.5)"
              >
                <HiUpload /> 파일 업로드
              </Button>
            </FileUploadTrigger>
            <FileUploadList />
          </FileUploadRoot>
        </Stack>

        <Button
          onClick={handleDividerUpload}
          fontSize={13}
          width="180px"
          background="rgba(255, 255, 255, 0.2)"
          alignSelf="center"
          _hover={{
            border: "2px solid rgba(0, 128, 0, 0.5)", // 형광 느낌의 테두리
            background: "rgba(0, 128, 0, 0.2)",
          }}
        >
          세션 추출하기
        </Button>
      </Stack>
    </Box>
  );
}

const frameworks = createListCollection({
  items: [
    { label: "보컬", value: "vocals" },
    { label: "어쿠스틱 기타", value: "acoustic_guitar" },
    { label: "피아노", value: "piano" },
    { label: "일렉트릭 기타", value: "electric_guitar" },
    { label: "신시사이저", value: "synthesizer" },
    { label: "베이스", value: "bass" },
    { label: "드럼", value: "drum" },
  ],
});
