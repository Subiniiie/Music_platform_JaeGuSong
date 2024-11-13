import { Button } from "@chakra-ui/react";
import {
  FileUploadRoot,
  FileUploadTrigger,
  FileUploadList,
} from "@/components/ui/file-button";
import { HiUpload } from "react-icons/hi";

interface FileUploaderProps {
  setFiles: (file: File | null) => void;
}

export function FileUploader({ setFiles }: FileUploaderProps) {
  const handleFileChange = (event: { acceptedFiles: File[] }) => {
    setFiles(event.acceptedFiles[0] || null);
  };

  return (
    <FileUploadRoot
      accept={["audio/*", "video/*"]}
      onFileChange={handleFileChange}
    >
      <FileUploadTrigger asChild>
        <Button
          variant="outline"
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
  );
}
