import { Box, Button, Stack, Text } from "@chakra-ui/react";
import DividerAnnouncementView from "../../sections/divider/announcement-view";
import { useDividerUpload } from "@/hooks/divider/useDividerUpload";
import { SessionSelection } from "@/sections/divider/sessionSelection";
import { FileUploader } from "@/sections/divider/fileUploader";
import { WsInfoBox } from "@/sections/divider/wsInfoBox";

export default function DividerUploadView() {
  const API_URL = import.meta.env.VITE_API_URL;
  const {
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
  } = useDividerUpload(API_URL);

  return (
    <Box
      width="100%"
      height="100%"
      alignContent="center"
      justifyItems="center"
      fontFamily="MiceGothic"
      color="white"
    >
      {isUploadSuccess ? (
        // 업로드 성공 시 Announcement 컴포넌트 렌더링
        <DividerAnnouncementView />
      ) : (
        <Stack width="450px">
          <WsInfoBox
            workspaceName={workspaceName}
            originTitle={originTitle}
            originSinger={originSinger}
            setWorkspaceName={setWorkspaceName}
            setOriginTitle={setOriginTitle}
            setOriginSinger={setOriginSinger}
          />

          {/* 세션 다중 선택 */}
          <SessionSelection
            selectedSessions={selectedSessions}
            setSelectedSessions={setSelectedSessions}
          />

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
            <FileUploader setFiles={setFiles} />
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
      )}
    </Box>
  );
}
