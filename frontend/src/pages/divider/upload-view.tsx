import { Box, Button, IconButton, Text } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "@/components/ui/file-button";
import { CloseButton } from "@/components/ui/close-button";

export default function DividerUploadView() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleFileUpload = (details: { acceptedFiles: File[] }) => {
    setFiles(details.acceptedFiles);
  };

  const handleFileRemove = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    toaster.success({
      title: "File removed",
      description: `${fileToRemove.name} has been removed.`,
    });
  };

  const sendFilesToBackend = async () => {
    if (files.length === 0) {
      toaster.error({
        title: "No files selected",
        description: "Please upload files before submitting.",
      });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("https://example.com/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("success");
      } else {
        setUploadStatus("error");
        toaster.error({
          title: "Upload failed",
          description: "There was an issue uploading the files.",
        });
      }
    } catch (error) {
      setUploadStatus("error");
      toaster.error({
        title: "Network error",
        description: "Failed to connect to the server.",
      });
    }
  };

  return (
    <div>
      {uploadStatus !== "success" && (
        <Box display="flex" justifyContent="center">
          <FileUploadRoot
            maxW="xl"
            alignItems="stretch"
            maxFiles={1}
            onFileChange={handleFileUpload}
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
                    onClick={() => handleFileRemove(file)}
                  >
                    <CloseButton />
                  </IconButton>
                </Box>
              ))}
            </FileUploadList>
          </FileUploadRoot>
        </Box>
      )}

      {/* 업로드 성공 또는 실패 메시지 */}
      {uploadStatus === "success" && (
        <Text color="green.500" mt={4}>
          Upload successful! Your files have been uploaded.
        </Text>
      )}
      {uploadStatus === "error" && (
        <Text color="red.500" mt={4}>
          Upload failed. Please try again.
        </Text>
      )}

      {uploadStatus !== "success" && (
        <Button onClick={sendFilesToBackend} mt={4}>
          Upload Files
        </Button>
      )}
    </div>
  );
}
