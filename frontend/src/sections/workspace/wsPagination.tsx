import { HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

interface WsPaginationProps {
  totalPage: number;
  onPageChange: (page: number) => void;
}

export default function WsPagination({
  totalPage,
  onPageChange,
}: WsPaginationProps) {
  return (
    <PaginationRoot
      count={totalPage * 10}
      pageSize={10}
      defaultPage={1}
      color="white"
      onPageChange={(e) => {
        onPageChange(e.page); // 상위 컴포넌트로 페이지 번호 전달
        console.log("e.page :", e.page);
      }}
    >
      <HStack>
        <PaginationPrevTrigger color="white" />
        <PaginationItems color="white" />
        <PaginationNextTrigger color="white" />
      </HStack>
    </PaginationRoot>
  );
}
