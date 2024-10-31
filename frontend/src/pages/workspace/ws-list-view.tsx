import { Stack, Flex } from "@chakra-ui/react";
import Filter from "@/sections/workspace/filter";
import Search from "@/sections/workspace/search";
import CardList from "@/sections/workspace/cardList";

export default function WsListView() {
  return (
    <Stack>
      {/* 상단 필터 및 검색 영역 */}
      <Flex justify="space-between" align="center">
        {/* 필터 컴포넌트 (예: 드롭다운) */}
        <Filter />

        {/* 검색 컴포넌트 */}
        <Search />
      </Flex>

      {/* 워크스페이스 카드 목록 */}
      <CardList />
    </Stack>
  );
}
