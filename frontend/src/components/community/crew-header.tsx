import React, { useState, useEffect } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import paths from '@/configs/paths';
import CommunityButton from './community-button';
import Modal from '../common/Modal';
import UseCommunityCrew from '@/hooks/community/useCommunityCrew';
import CrewMemeberListModal from './crew-member-list-modal';

const CrewHeader: React.FC = () => {
    const navigate = useNavigate();

    const {
      openCrewFollowModal,
      openCrewJoinModal,
      openCrewWithdrawModal,
      openCrewMembersModal,
      crewNameSeq,
      crewName,
      crewManagerName,
      crewProfileImage,
      crewMakeDate,
      crewMembers,
      myCrewsSeq,
      myName,
      goCrewFollow,
      goJoinCrew,
      goWithdrawCrew,
      handleCrewFollowModal,
      handleCrewJoinModal,
      handleCrewApproveModal,
      handleCrewWithdrawModal,
      handleCrewMembers,
      preGetCrewInfo
    } = UseCommunityCrew();

    useEffect(() => {
      if (!myCrewsSeq || !crewNameSeq) {
        preGetCrewInfo();
      }
    }, [myCrewsSeq, crewNameSeq]);

    const goCreateArticle = () => {
      navigate(paths.community.create);
  }

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
            <Text textStyle="3xl" marginRight="20px">{crewName}</Text>
            <CommunityButton 
              title='팔로우' 
              onClick={handleCrewFollowModal}
            />
            { !myCrewsSeq.includes(crewNameSeq) && 
              <CommunityButton 
                title='가입요청' 
                onClick={handleCrewJoinModal}
              />
            }
            <Button variant="ghost" color="white" onClick={handleCrewMembers}>크루원 보기</Button>
            { myName === crewManagerName && 
              <Button 
              onClick={handleCrewApproveModal}
              variant="ghost" 
              color="white" 
              >
                가입 요청 확인하기
              </Button>
            }
          </Box> 
          <Box marginTop="10px">
            <Text>크루장: {crewManagerName}</Text>
            <Text>개설일: {crewMakeDate}</Text>
          </Box>            
        </Box>        
        <Box 
          height="20px"
          display="flex"
          marginTop="20px"
          justifyContent="flex-end"
          gap="5px"
        >
          { myName === crewManagerName && 
            <>
              <CommunityButton 
                title='글쓰기'
                onClick={goCreateArticle}
              />
              <CommunityButton
                title='음원피드 올리기'
                onClick={goCreateArticle}
              />
            </>
          }
          { myCrewsSeq.includes(crewNameSeq) && 
            <CommunityButton 
              title='탈퇴하기'
              onClick={handleCrewWithdrawModal}
            />
          }  
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
