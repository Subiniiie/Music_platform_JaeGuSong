import React from 'react';
import InputContainer from '@/components/community/input-container';
import Header from '@/components/community/header';
import Container from '@/components/community/container';

const CommunityCreateView: React.FC = () => {
  return (
    <>
      <Header />
      <Container>
        <InputContainer />
      </Container>  
    </>
  );
};

export default CommunityCreateView;