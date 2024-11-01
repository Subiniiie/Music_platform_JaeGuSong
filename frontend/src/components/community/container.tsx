import React, { ReactNode, Children } from 'react';
import { Box } from "@chakra-ui/react"
import ArticleList from './artice-list';

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
        marginTop="130px"
        marginRight="20px"
        overflowY="auto"
    >
        {children}
    </Box>
  );
};

export default Container;