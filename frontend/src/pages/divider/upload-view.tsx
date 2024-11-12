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
import { toaster } from "@/components/ui/toaster";
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

export default function DividerUploadView() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [originTitle, setOriginTitle] = useState("");
  const [originSinger, setOriginSinger] = useState("");
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]); // 세션 선택 상태

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: { files: File[] }) => {
    // setFiles(event.files); // files 배열을 setFiles로 전달
    setFiles(event.acceptedFiles[0]); // files 배열을 setFiles로 전달
    console.log("event :", event);
    console.log(event.acceptedFiles[0]);
    console.log("files :", files);
  };

  // const handleFileChange = (event: any) => {
  //   setFiles(event.target.files); // target.files를 통해 파일 배열을 setFiles로 전달
  // };

  const handleDividerUpload = async () => {
    console.log(
      "안녕, 난 handleDividerUpload. 디바이더 업로드 api 요청 보내볼게"
    );
    if (!files || files.length === 0) {
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
    <Box>
      <Stack>
        <Text color={"white"}>세션 추출하기</Text>
        {/* 파일 업로드 */}
        <FileUploadRoot
          accept={["audio/*", "video/*"]}
          onFileChange={handleFileChange}
          // onFileChange={(event) => handleFileChange(event)}
        >
          <FileUploadTrigger asChild>
            <Button variant="outline" size="sm" background={"white"}>
              {/* 파일 업로드 버튼 내의 아이콘 + 문구 */}
              <HiUpload /> 파일 업로드
            </Button>
          </FileUploadTrigger>
          <FileUploadList />
        </FileUploadRoot>

        {/* 파일 업로드 유효성 검사 실패 문구
        {errors.file && (
          <Text color="red.500" fontSize="xs">
            {errors.file}
          </Text>
        )} */}
        <Stack gap={2}>
          <Input
            placeholder="워크스페이스 이름을 입력해주세요."
            size="sm"
            fontFamily="MiceGothic"
            fontSize={11}
            background={"white"}
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
          <Input
            placeholder="작업할 곡의 원곡명을 입력해주세요."
            size="sm"
            fontFamily="MiceGothic"
            fontSize={11}
            background={"white"}
            value={originTitle}
            onChange={(e) => setOriginTitle(e.target.value)}
          />
          <Input
            placeholder="작업할 곡의 원곡자를 입력해주세요."
            size="sm"
            fontFamily="MiceGothic"
            fontSize={11}
            background={"white"}
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
          >
            <Fieldset.Legend
              fontSize={14}
              mb="2"
              fontFamily="MiceGothic"
              color={"white"}
            >
              추출할 세션 선택하기
            </Fieldset.Legend>
            <Fieldset.Content>
              {frameworks.items.map((session) => (
                <Checkbox
                  fontFamily="MiceGothic"
                  fontSize={8}
                  key={session.value}
                  color={"white"}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    handleCheckboxChange(session.value, target.checked);
                    console.log("체크박스 이벤트 발생 :", session.value);
                  }}
                >
                  {session.label}
                </Checkbox>
              ))}
            </Fieldset.Content>
          </CheckboxGroup>
        </Fieldset.Root>

        <Button onClick={handleDividerUpload}>세션 추출하기</Button>
      </Stack>
    </Box>
  );
}

const frameworks = createListCollection({
  items: [
    { label: "보컬", value: "vocals" },
    { label: "피아노", value: "piano" },
    { label: "신시사이저", value: "synthesizer" },
    { label: "어쿠스틱 기타", value: "acoustic_guitar" },
    { label: "일렉트릭 기타", value: "electric_guitar" },
    { label: "베이스", value: "bass" },
    { label: "드럼", value: "drum" },
    // { label: "etc.", value: "etc." },
  ],
});
