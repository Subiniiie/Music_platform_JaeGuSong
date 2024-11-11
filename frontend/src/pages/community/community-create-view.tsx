import React from 'react';
import InputContainer from '@/components/community/input-container';
import Header from '@/components/community/header';
import CrewHeader from '@/components/community/crew-header';
import Container from '@/components/community/container';
import useHeaderStore from '@/stores/headerStore';

const CommunityCreateView: React.FC = () => {
  const { openUserHeader } = useHeaderStore(state => state);

  return (
    <>
      {openUserHeader ? <Header /> : <CrewHeader />}
      <Container>
        <InputContainer />
      </Container>  
    </>
  );
};

export default CommunityCreateView;