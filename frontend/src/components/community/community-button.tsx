import React from 'react';
import { Button } from '@chakra-ui/react';

interface CommunityButtonProps {
    title: string;
    onClick?: () => void;
}

const CommunityButton: React.FC<CommunityButtonProps> = ({title, onClick}) => {
  return (
    <Button
        background='#1c1b3f'
        width='auto'
        height='40px'
        px={4}
        onClick={onClick} 
    >
        {title}
    </Button>
  );
};

export default CommunityButton;