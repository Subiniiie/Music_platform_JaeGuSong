"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";
import ChatList from "../chat/chatlist";
export function Provider(props: React.PropsWithChildren) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
      <ChatList />
    </ChakraProvider>
  );
}
