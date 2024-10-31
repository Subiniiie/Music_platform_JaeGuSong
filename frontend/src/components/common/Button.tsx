import React from "react";
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

interface CustomButtonProps extends Omit<ButtonProps, "variant" | "isLoading"> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  isLoading = false,
  children,
  ...props
}) => {
  return (
    <ChakraButton
      isLoading={isLoading}
      bg="#1c1b3f"
      _hover={{ bg: "#4e4b7e" }}
      borderRadius="20px"
      padding="30px"
      fontSize="18px"
      position="fixed"
      bottom="20px"
      right="20px"
      fontFamily="OneMobile"
      {...props}
    >
      {children}
    </ChakraButton>
  );
};

export default CustomButton;
