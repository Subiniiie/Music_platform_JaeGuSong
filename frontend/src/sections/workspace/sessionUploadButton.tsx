import { useState } from "react";
import axios from "axios";
import { Button, Text } from "@chakra-ui/react";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-button";
import { HiUpload } from "react-icons/hi";
import { toaster } from "@/components/ui/toaster";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SessionUploadButtonProps {
  workspaceSeq: number; // workspaceSeq를 props로 추가
}

// Base64 인코딩 함수
const encodeFileToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};

export default function SessionUploadButton({ workspaceSeq }: SessionUploadButtonProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState({
    file: "", // 파일 업로드 오류 메시지
  });
  const API_URL = import.meta.env.VITE_API_URL;

  const handleCreateSession = async () => {
    console.log('세션 업로드 api 요청 보내는 handleCreateSession 실행시켜볼게')
    console.log('files :', files)
    console.log('files.acceptedFiles :', files.acceptedFiles)
    console.log('files.acceptedFiles[0] :', files.acceptedFiles[0])
    console.log('files.acceptedFiles[0].name :', files.acceptedFiles[0].name)

    if (files.length === 0) {
      setErrors({ file: "파일을 업로드해주세요." });
      return;
    }

    // const formData = new FormData();
    // formData.append("session", files[0]); // 첫 번째 파일만 업로드

    const formData = new FormData();
    formData.append("session", files.acceptedFiles[0]); // 첫 번째 파일만 업로드


    try {
      // 파일을 Base64로 인코딩
      // const base64File = await encodeFileToBase64(files.acceptedFiles[0]);
      // console.log('base64File :', base64File)
      console.log('formData', formData)
      const storedToken = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${API_URL}/api/workspaces/${workspaceSeq}/session`,
        // {
        //   session: base64File,
        // },
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            // "Content-Type": "application/json",
          },
        }
      );

      toaster.create({
        description: "세션이 성공적으로 추가되었습니다.",
        type: "success",
      });

      // onWorkspaceCreated(); // 세션 추가 후 목록을 다시 로드
    } catch (error) {
      console.error("Error adding session:", error);
      toaster.create({
        description: "세션 추가에 실패했습니다.",
        type: "error",
      });
    }
  };

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          fontFamily="MiceGothic"
          fontSize={13}
          color="white"
        >
          세션 추가
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
            세션 추가
          </PopoverTitle>

          {/* 파일 업로드 */}
          <FileUploadRoot accept={["audio/*", "video/*"]} onFileChange={setFiles}>
            <FileUploadTrigger asChild>
              <Button variant="outline" size="sm">
                {/* 파일 업로드 버튼 내의 아이콘 + 문구 */}
                <HiUpload /> 파일 업로드
              </Button>
            </FileUploadTrigger>
            <FileUploadList />
          </FileUploadRoot>

          {/* 파일 업로드 유효성 검사 실패 문구 */}
          {errors.file && (
            <Text color="red.500" fontSize="xs">
              {errors.file}
            </Text>
          )}

          <Button
            size="sm"
            variant="outline"
            fontFamily="MiceGothic"
            fontSize={11}
            mt={4}
            onClick={handleCreateSession}
          >
            추가하기
          </Button>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}
