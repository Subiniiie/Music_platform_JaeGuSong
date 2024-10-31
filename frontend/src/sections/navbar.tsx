import { Box, Button, Flex, Image, Link, Stack } from "@chakra-ui/react";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import paths from "@/configs/paths";

export default function Navbar() {
  const items = [
    {
      value: "a",
      title: "커뮤니티",
      text: [
        { label: "검색", path: paths.search },
        { label: "내 피드", path: paths.feed },
      ],
    },
    {
      value: "b",
      title: "디바이더",
      text: [
        { label: "음원 업로드", path: paths.divider.upload },
        { label: "워크스페이스", path: paths.workspace.list },
      ],
    },
    {
      value: "c",
      title: "미니 게임",
      text: [
        { label: "절대음감", path: paths.game.keyboards },
        { label: "리듬킹", path: paths.game.drum },
        { label: "퍼펙트 싱어", path: paths.game.vocal },
      ],
    },
  ];

  return (
    <Stack padding="0" fontFamily="MiceGothicBold">
      <Box width="100%" margin="0" paddingY="4">
        {/* public 폴더에서 인식 */}
        <Link href={paths.main}>
          <Image src="/common/Logo.png" alt="Logo.png" />
        </Link>
      </Box>
      <Stack>
        <Flex gap="2">
          <Button
            border="solid 2px #9000FF"
            borderRadius="15px"
            height="30px"
            width="80px"
          >
            로그인
          </Button>
          <Button
            border="solid 2px #9000FF"
            borderRadius="15px"
            height="30px"
            width="80px"
          >
            회원가입
          </Button>
        </Flex>
      </Stack>
      <AccordionRoot collapsible defaultValue={["b"]}>
        {items.map((item, index) => (
          <AccordionItem key={index} value={item.value} paddingY="1">
            <AccordionItemTrigger color="white">
              {item.title}
            </AccordionItemTrigger>
            <AccordionItemContent color="white">
              {item.text.map((linkItem, i) => (
                <Link
                  key={i}
                  href={linkItem.path}
                  color="white"
                  display="block"
                  paddingY="1"
                >
                  {linkItem.label}
                </Link>
              ))}
            </AccordionItemContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </Stack>
  );
}
