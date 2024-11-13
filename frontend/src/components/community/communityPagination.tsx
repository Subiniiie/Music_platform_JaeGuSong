import React from "react";
import { Button, HStack } from "@chakra-ui/react";

interface CommunityPaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

const CommunityPagination: React.FC<CommunityPaginationProps> = ({
  currentPage,
  totalPage,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPage) {
      onPageChange(page);
    }
  };

  return (
    <HStack spacing={2} justifyContent="center" marginTop="20px" overflowY="hidden">
      {/* 이전 페이지 화살표 */}
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        aria-label="Previous page"
        backgroundColor="#02001F"
        color="white"
        borderRadius="full"
        padding="8px 16px"
        _hover={{
          backgroundColor: "#4e4b7e", // 보라색 계열로 호버 효과
          transform: "scale(1.05)",
        }}
        _disabled={{
          backgroundColor: "#333",
        }}
      >
        {"←"} {/* Unicode 화살표 */}
      </Button>

      {/* 페이지 번호 버튼 */}
      {Array.from({ length: totalPage }, (_, index) => index + 1).map((page) => (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          colorScheme={page === currentPage ? "purple" : "gray"} // 현재 페이지일 경우 보라색
          backgroundColor={page === currentPage ? "#6a4c9c" : "#02001F"} // 보라색 계열로 강조
          color={page === currentPage ? "white" : "#c2c2c2"} // 강조된 버튼은 흰색
          borderRadius="full"
          padding="8px 16px"
          _hover={{
            backgroundColor: "#6a4c9c", // 보라색 계열로 호버 효과
            color: "white",
            transform: "scale(1.05)",
          }}
        >
          {page}
        </Button>
      ))}

      {/* 다음 페이지 화살표 */}
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage === totalPage}
        aria-label="Next page"
        backgroundColor="#02001F"
        color="white"
        borderRadius="full"
        padding="8px 16px"
        _hover={{
          backgroundColor: "#4e4b7e", // 보라색 계열로 호버 효과
          transform: "scale(1.05)",
        }}
        _disabled={{
          backgroundColor: "#333",
        }}
      >
        {"→"} {/* Unicode 화살표 */}
      </Button>
    </HStack>
  );
};

export default CommunityPagination;
