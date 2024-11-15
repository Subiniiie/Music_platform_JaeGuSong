"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";
import ChatList from "../chat/chatlist";
import { useLocation } from "react-router-dom";

export function Provider(props: React.PropsWithChildren) {
  const location = useLocation();

  const excludedPaths = ["/signin", "/signup"];
  const shouldRenderChatList = !excludedPaths.includes(location.pathname);

  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        {props.children}
        {shouldRenderChatList && <ChatList />}
      </ColorModeProvider>
    </ChakraProvider>
  );
}
