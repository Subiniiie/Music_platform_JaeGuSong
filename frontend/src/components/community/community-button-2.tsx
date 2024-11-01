import React from 'react';
import { Button } from '@chakra-ui/react';

interface CommunityButtonProps {
    title: string;
    onClick?: () => void;
}

const CommunityButton2: React.FC<CommunityButtonProps> = ({title, onClick}) => {
  return (
    <Button
    backgroundColor="transparent" 
    _hover={{ transform: "translateY(-2px)", bg: "transparent" }}
      height="30px"
      width="auto"
        onClick={onClick} 
    >
        {title}
    </Button>
  );
};

export default CommunityButton2;