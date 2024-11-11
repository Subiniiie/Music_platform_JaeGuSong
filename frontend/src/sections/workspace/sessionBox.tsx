import Session from "@/components/workspace/session";
import { Stack } from "@chakra-ui/react";

interface SessionBoxProps {
  sessions: {
    soundSeq: number;
    startPoint: number;
    endPoint: number;
    type: string;
    url: string;
  };
  workspaceSeq: number; // workspaceSeq를 props로 추가
  // onDeleteSession: (sessionId: string) => void; // 삭제 핸들러 추가
  onSessionDelete: (sessionId: number) => void;
}

// export default function SessionBox({ sessions, workspaceSeq, onDeleteSession }: SessionBoxProps) {
export default function SessionBox({ sessions, workspaceSeq, onSessionDelete }: SessionBoxProps) {
  return (
    <Stack>
      {sessions.map((session) => (
        <Session
        key={session.soundSeq}
        sessionId={session.soundSeq.toString()}
        url={session.url}
        type={session.type}
        startPoint={session.startPoint}
        endPoint={session.endPoint}
        workspaceSeq={workspaceSeq}
        // onDelete={onDeleteSession} // 삭제 핸들러 전달
        onSessionDelete={onSessionDelete}
        />
      ))}
    </Stack>
  );
}
