import React, { useState } from 'react';
import { CrewData } from './crew-member-list-modal';
import { Box, Text } from '@chakra-ui/react';
import { Radio, RadioGroup } from "../ui/radio";


interface CrewMemeberListContainerProps {
    crewData: CrewData | null;
    chatUserSeq: number;
    checkManagerSeq: boolean;
    chatValue: string;
    setChatValue: React.Dispatch<React.SetStateAction<string>>;
}

const CrewMemeberListChat: React.FC<CrewMemeberListContainerProps> = ({ crewData, chatUserSeq, checkManagerSeq, chatValue, setChatValue }) => {

  return (
    <Box marginTop="20px">
    <Text color="black">채팅장</Text>
    <RadioGroup 
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop="80px"
      gap="45px"
      value={chatValue || chatUserSeq.toString()}
      onChange={(e) => setChatValue((e.target as HTMLInputElement).value)}
      disabled={!checkManagerSeq}
    >
      {crewData?.crews.map((crewMember, index) => (
          <Radio key={crewMember.seq} value={crewMember.seq.toString()} margin="2px 0"></Radio>
        ))}
    </RadioGroup>
  </Box>
  );
};

export default CrewMemeberListChat;