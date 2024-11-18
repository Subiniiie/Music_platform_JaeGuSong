import React from "react";
import { Button } from "@chakra-ui/react";

interface CommunityButtonProps {
  title: string;
  onClick?: () => void;
}

const CommunityButton2: React.FC<CommunityButtonProps> = ({
  title,
  onClick,
}) => {
  return (
    <Button
      backgroundColor="#1c1b3f"
      _hover={{ transform: "translateY(-2px)", bg: "#4e4b7e" }}
      height="40px"
      width="auto"
      onClick={onClick}
      marginLeft="10px"
    >
      {title}
    </Button>
  );
};

export default CommunityButton2;
