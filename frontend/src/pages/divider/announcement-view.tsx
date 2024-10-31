import { Card, Heading, Stack } from "@chakra-ui/react";

export default function DividerAnnouncementView() {
  return (
    <Stack>
      <Card.Root size="sm">
        <Card.Header>
          <Heading size="md"> Card - sm</Heading>
        </Card.Header>
        <Card.Body color="fg.muted">AnnouncementView</Card.Body>
      </Card.Root>
    </Stack>
  );
}
