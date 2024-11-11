import { Card, Badge, Box, HStack, Image, Stack, Flex } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";

interface CardListProps {
  wsList: {
    workspaceSeq: number;
    name: string;
    thumbnail: string;
    state: string;
    originTitle: string; // 추후 api 수정 시 추가 예정
    originSinger: string; // 추후 api 수정 시 추가 예정
  }[]; // 필요에 따라 각 워크스페이스의 데이터 필드를 수정
}

export default function CardList({ wsList }: CardListProps) {
  const navigate = useNavigate();

  // const handleCardClick = (workspaceId: number) => {
  //   navigate(`${paths.workspace.list}/${workspaceId}`);
  // };
  const handleCardClick = (workspaceSeq: number) => {
    navigate(paths.workspace.detail(workspaceSeq));
  };

  return (
    <Stack>
      {wsList.map((ws) => (
        <Card.Root
          key={ws.workspaceSeq}
          flexDirection="row"
          overflow="hidden"
          maxW="xl"
        >
          <Image
            objectFit="cover"
            maxW="200px"
            // src={
            //   ws.thumbnail ||
            //   "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
            // }
            src={
              "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
            }
            alt="Thumbnail"
          />
          <Box>
            <Flex justifyContent="space-between">
              <Stack>
                <Card.Body>
                  <Card.Title mb="3">{ws.name || "워크스페이스"}</Card.Title>
                  {/* <Card.Description>
                    Caffè latte is a coffee beverage of Italian origin made with espresso
                    and steamed milk.
                  </Card.Description> */}
                  <HStack gap="4">
                    <Badge>{ws.originTitle || "원곡명"}</Badge>
                    <Badge>{ws.originSinger || "원곡자"}</Badge>
                    <Badge>{ws.state || "공개여부"}</Badge>
                  </HStack>
                </Card.Body>
              </Stack>
              <Card.Footer>
                <Button onClick={() => handleCardClick(ws.workspaceSeq)}>
                  <RiArrowRightLine />
                </Button>
              </Card.Footer>
            </Flex>
          </Box>
        </Card.Root>
      ))}
    </Stack>
  );
}
