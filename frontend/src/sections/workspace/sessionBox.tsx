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
  workspaceSeq: number;
  onSessionDelete: (sessionId: number) => void;
  role: string;
}

// export default function SessionBox({ sessions, workspaceSeq, onDeleteSession }: SessionBoxProps) {
export default function SessionBox({
  sessions,
  workspaceSeq,
  onSessionDelete,
  role,
}: SessionBoxProps) {
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
          // onSessionDelete={onSessionDelete}
          onSessionDelete={role === "MASTER" ? onSessionDelete : undefined}
          role={role}
        />
      ))}
    </Stack>
  );
}
