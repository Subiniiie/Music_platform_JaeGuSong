import { HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

export default function WsPagination() {
  return (
    <PaginationRoot count={20} pageSize={2} defaultPage={1} color="white">
      <HStack>
        <PaginationPrevTrigger color="white" />
        <PaginationItems color="white" />
        <PaginationNextTrigger color="white" />
      </HStack>
    </PaginationRoot>
  );
}
