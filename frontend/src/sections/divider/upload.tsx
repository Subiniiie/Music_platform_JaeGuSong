import { CloseButton } from "@/components/ui/close-button";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "@/components/ui/file-button";
import { Box, IconButton } from "@chakra-ui/react";

interface UploadProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onFileRemove: (file: File) => void;
}

export default function Upload({ files, setFiles, onFileRemove }: UploadProps) {
  const handleFileUpload = (details: { acceptedFiles: File[] }) => {
    setFiles(details.acceptedFiles);
  };

  return (
    <FileUploadRoot
      maxW="xl"
      alignItems="stretch"
      maxFiles={1}
      accept={["audio/*", "video/*"]}
      onFileChange={handleFileUpload}
      accept={["audio/*", "video/*"]}
    >
      <FileUploadDropzone
        label="Drag and drop here to upload"
        description=".png, .jpg up to 5MB"
      />
      <FileUploadList>
        {files.map((file, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2}
            borderWidth={1}
            borderRadius="md"
            mb={2}
          >
            <span>{file.name}</span>
            <IconButton
              aria-label="Remove file"
              size="sm"
              onClick={() => onFileRemove(file)}
            >
              <CloseButton />
            </IconButton>
          </Box>
        ))}
      </FileUploadList>
    </FileUploadRoot>
  );
}
