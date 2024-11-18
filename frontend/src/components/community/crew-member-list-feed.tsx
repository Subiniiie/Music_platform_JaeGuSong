import React, { useState} from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Radio, RadioGroup } from '../ui/radio';
import { CrewData } from './crew-member-list-modal';


interface CrewMemeberListContainerProps {
    crewData: CrewData | null;
    boardUserSeq: number;
    checkManagerSeq: boolean;
    feedValue: string;
    setFeedValue: React.Dispatch<React.SetStateAction<string>>;
}

const CrewMemeberListFeed: React.FC<CrewMemeberListContainerProps> = ({ crewData, boardUserSeq, checkManagerSeq, feedValue, setFeedValue }) => {

    

  return (
    <Box marginTop="20px">
    <Text color="black">피드장</Text>
    <RadioGroup 
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop="80px"
      gap="45px"
      value={feedValue || (boardUserSeq ? boardUserSeq.toString() : '')}
      onChange={(e) => {
        const target = e.target as HTMLInputElement;
        if (target && target.value) {
          setFeedValue(target.value);
        } else {
          console.error("Invalid target in onChange event:", e);
        }
      }}
      disabled={!checkManagerSeq}
    >
      {crewData?.crews.map((crewMember) => (
          <Radio key={crewMember.seq} value={crewMember.seq.toString() || ''} margin="2px 0"></Radio>
        ))}
    </RadioGroup>
  </Box>
  );
};

export default CrewMemeberListFeed;