import Session from "@/components/workspace/session";
import { Stack } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

export default function SessionBox() {
  const sessions = [
    { id: uuidv4(), title: "Session 1" },
    { id: uuidv4(), title: "Session 2" },
    { id: uuidv4(), title: "Session 3" },
  ];

  return (
    <Stack>
      {sessions.map((session) => (
        <Session key={session.id} sessionId={session.id} />
      ))}
    </Stack>
  );
}
