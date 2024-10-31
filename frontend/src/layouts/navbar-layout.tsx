import { Outlet } from "react-router-dom";
import Navbar from "../sections/navbar";
import { Flex, Box } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";

export default function NavbarLayout() {
  return (
    <Flex direction="row" height="100vh">
      {/* Navbar */}
      <Box
        width={{ base: "200px", md: "250px" }} // 최소 폭 설정
        minWidth="200px"
        bg="gray.100"
        p="4"
        boxShadow="md"
        background="#02001F"
      >
        <Navbar />
      </Box>

      {/* Outlet (content area) */}
      <Box flex="1" p={4}>
        <Outlet />
      </Box>
      <Toaster />
    </Flex>
  );
}
