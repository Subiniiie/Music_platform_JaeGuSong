import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import Upload from "@/sections/divider/upload";
import DividerButton from "@/sections/divider/dividerButton";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";

export default function DividerUploadView() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const artistSeq = useAuthStore((state) => state.artistSeq);

  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [files, setFiles] = useState<File[]>([]);

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

  const handleFileRemove = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    toaster.success({
      title: "File removed",
      description: `${fileToRemove.name} has been removed.`,
    });
  };

  // 디바이더 요청 성공 후 navigate 처리를 위한 콜백 함수
  const handleDividerSuccess = () => {
    navigate(paths.divider.announcement);
  };

  return (
    <Flex direction="column" height="100%" justifyContent="center" gap="5">
      {uploadStatus !== "success" && (
        <Box display="flex" justifyContent="center">
          <Upload
            files={files}
            setFiles={setFiles}
            onFileRemove={handleFileRemove}
          />
        </Box>
      )}

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

      <DividerButton
        artistSeq={artistSeq}
        onDividerSuccess={handleDividerSuccess}
      />
    </Flex>
  );
}
