import { useState } from "react";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";

export interface UseDividerUploadReturn {
  workspaceName: string;
  originTitle: string;
  originSinger: string;
  selectedSessions: string[];
  files: File | null;
  isUploadSuccess: boolean;
  setWorkspaceName: (value: string) => void;
  setOriginTitle: (value: string) => void;
  setOriginSinger: (value: string) => void;
  setSelectedSessions: (value: string[]) => void;
  setFiles: (file: File | null) => void;
  handleDividerUpload: () => Promise<void>;
}

export function useDividerUpload(API_URL: string): UseDividerUploadReturn {
  const [workspaceName, setWorkspaceName] = useState("");
  const [originTitle, setOriginTitle] = useState("");
  const [originSinger, setOriginSinger] = useState("");
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [files, setFiles] = useState<File | null>(null);

  const handleDividerUpload = async () => {
    if (!files) {
      toaster.error({
        title: "No files selected",
        description: "Please upload files before submitting.",
      });
      return;
    }

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
      setIsUploadSuccess(true);
    } catch (error) {
      console.error("Error adding session:", error);
      toaster.error({
        description: "디바이더 업로드에 실패했습니다.",
        type: "error",
      });
    }
  };

  return {
    workspaceName,
    originTitle,
    originSinger,
    selectedSessions,
    files,
    isUploadSuccess,
    setWorkspaceName,
    setOriginTitle,
    setOriginSinger,
    setSelectedSessions,
    setFiles,
    handleDividerUpload,
  };
}
