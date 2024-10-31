import { Card, Heading, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";

export default function CardList() {
  const navigate = useNavigate();

  const handleCardClick = (workspaceId: number) => {
    navigate(`${paths.workspace.list}/${workspaceId}`);
  };
  return (
    // 워크스페이스 카드 목록
    <Stack>
      {[1, 2, 3].map((id) => (
        <Card.Root
          key={id}
          size="sm"
          onClick={() => handleCardClick(id)}
          cursor="pointer"
        >
          <Card.Header>
            <Heading size="md">워크스페이스 {id}</Heading>
          </Card.Header>
          <Card.Body color="fg.muted">현우의 워크스페이스 {id}</Card.Body>
        </Card.Root>
      ))}
    </Stack>
  );
}
