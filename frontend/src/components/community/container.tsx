import React, { ReactNode, Children } from "react";
import { Box } from "@chakra-ui/react";
import ArticleList from "./artice-list";

interface ContainerProps {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <Box
      position="fixed"
      border="2px solid #9000FF"
      borderRadius="8px"
      width="calc(100% - 280px)"
      minHeight="100vh"
      height="100px"
      marginTop="150px"
      marginRight="20px"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#e3f2f9",
          borderRadius: "20px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#02001F",
          borderRadius: "20px",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default Container;
