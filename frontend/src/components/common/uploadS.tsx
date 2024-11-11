import { Button } from "@/components/ui/button";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-button";
import { HiUpload } from "react-icons/hi";

export default function UploadS() {
  return (
    <FileUploadRoot>
      <FileUploadTrigger asChild>
        <Button variant="outline" size="sm">
          <HiUpload /> Upload file
        </Button>
      </FileUploadTrigger>
      <FileUploadList />
    </FileUploadRoot>
  );
}
