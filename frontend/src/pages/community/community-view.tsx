import React from 'react';
import { Outlet } from 'react-router-dom';

const CommunityView: React.FC = () => {

  return (
    <div style={{ color: 'white', fontFamily: "MiceGothicBold" }}>
        <Outlet />
    </div>
    );
};

export default CommunityView;