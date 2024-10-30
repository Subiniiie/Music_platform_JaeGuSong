import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e3f2f9" },
          100: { value: "#c5e4f3" },
          500: { value: "#02001F" }, // 주요 색상 설정
          900: { value: "#0d47a1" },
        },
        background: { value: "#02001F" },
      },
    },
  },
});
