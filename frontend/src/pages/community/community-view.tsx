import React from 'react';
import Header from '@/components/community/header';
import Container from '@/components/community/container';
import { Outlet } from 'react-router-dom';

const CommunityView: React.FC = () => {
  return (
    <div style={{ color: 'white', fontFamily: "MiceGothicBold" }}>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </div>
    );
};

export default CommunityView;