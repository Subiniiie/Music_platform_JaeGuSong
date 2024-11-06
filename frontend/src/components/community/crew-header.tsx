import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import CommunityButton from './community-button';
import Modal from '../common/Modal';
import UseCommunityCrew from '@/hooks/community/useCommunityCrew';
import CrewMemeberListModal from './crew-member-list-modal';

const CrewHeader: React.FC = () => {
    const {
      openCrewFollowModal,
      openCrewJoinModal,
      openCrewWithdrawModal,
      openCrewMembersModal,
      goCrewFollow,
      goJoinCrew,
      goWithdrawCrew,
      handleCrewFollowModal,
      handleCrewJoinModal,
      handleCrewWithdrawModal,
      handleCrewMembers
    } = UseCommunityCrew();

  return (
    <>
      <Box
          position="fixed"
          top="0"
          left="250px"
          width="calc(100% - 250px)" 
          padding="4"
      >
        <Box height="70px">
          <Box
            display="flex"
            flexDirection="row"
            gap="5px"
          >
            <Text>크루 정보 받아올거임</Text>
            <CommunityButton 
              title='팔로우' 
              onClick={handleCrewFollowModal}
            />
            <CommunityButton 
              title='가입요청' 
              onClick={handleCrewJoinModal}
            />
          </Box> 
          <Button onClick={handleCrewMembers}>크루원 보기</Button>
          <Text>크루장</Text>
          <Text>개설일</Text>
        </Box>        
        <Box 
          height="20px"
          display="flex"
          marginTop="20px"
          justifyContent="flex-end"
        >
          <CommunityButton 
            title='탈퇴하기'
            onClick={handleCrewWithdrawModal}
          />
        </Box>        
      </Box>

      {openCrewFollowModal && 
        <Modal 
          isOpen={openCrewFollowModal}
          onClose={handleCrewFollowModal}
        >
          <Box padding="5px 20px">
            <Text color="black" margin="40px">팔로우하시겠습니까?</Text>
            <Box 
                margin="10px"  
                display="flex" 
                justifyContent="center"
                gap="10px"
            >
              <CommunityButton title="예" onClick={goCrewFollow} />
              <CommunityButton title="아니요" onClick={handleCrewFollowModal} />
            </Box>
          </Box>    
        </Modal>
      }
      {openCrewJoinModal && 
        <Modal 
          isOpen={openCrewJoinModal}
          onClose={handleCrewJoinModal}
        >
          <Box padding="5px 20px">
            <Text color="black" margin="40px">가입하시겠습니까?</Text>
            <Box 
                margin="10px"  
                display="flex" 
                justifyContent="center"
                gap="10px"
            >
              <CommunityButton title="예" onClick={goJoinCrew} />
              <CommunityButton title="아니요" onClick={handleCrewJoinModal} />
            </Box>
          </Box>    
        </Modal>
      }

      {openCrewWithdrawModal && 
        <Modal 
          isOpen={openCrewWithdrawModal}
          onClose={handleCrewWithdrawModal} 
        >
          <Box padding="5px 20px">
            <Text color="black" margin="40px">탈퇴하시겠습니까?</Text>
            <Box 
                margin="10px"  
                display="flex" 
                justifyContent="center"
                gap="10px"
            >
              <CommunityButton title="예" onClick={goWithdrawCrew} />
              <CommunityButton title="아니요" onClick={handleCrewWithdrawModal} />
            </Box>
          </Box> 
        </Modal>
      }
      { openCrewMembersModal && <CrewMemeberListModal isOpen={openCrewMembersModal} onClose={handleCrewMembers} /> }
     
    </>  
  );
};

export default CrewHeader;
