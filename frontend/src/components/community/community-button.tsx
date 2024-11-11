import React from "react";
import { Button } from "@chakra-ui/react";

interface CommunityButtonProps {
  title: string;
  onClick?: () => void;
}

const CommunityButton: React.FC<CommunityButtonProps> = ({
  title,
  onClick,
}) => {
  return (
    <Button
      border="solid 2px #9000FF"
      borderRadius="15px"
      height="30px"
      width="auto"
      _hover={{
        color: "#9000ff",
        border: "solid 2px white",
      }}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default CommunityButton;
