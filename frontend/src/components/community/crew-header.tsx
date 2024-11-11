import React, { useEffect } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import useCrewSeqStore from '@/stores/crewSeqStore';
import paths from '@/configs/paths';
import CommunityButton from './community-button';
import Modal from '../common/Modal';
import UseCommunityCrew from '@/hooks/community/useCommunityCrew';
import CrewMemeberListModal from './crew-member-list-modal';

const CrewHeader: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{id: string}>();
    const setGetCrewSeq = useCrewSeqStore((state) => state.setGetCrewSeq);


    const {
      openCrewFollowModal,
      openCrewJoinModal,
      openCrewWithdrawModal,
      openCrewMembersModal,
      openCrewApproveModal,
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
      setOpenCrewApproveModal,
      handleCrewFollowModal,
      handleCrewJoinModal,
      handleCrewApproveModal,
      handleCrewDeclineModal,
      handleCrewWithdrawModal,
      handleCrewMembers,
      preGetCrewInfo
    } = UseCommunityCrew();

    useEffect(() => {
      if (!myCrewsSeq || !crewNameSeq) {
        preGetCrewInfo();
      }
    }, [myCrewsSeq, crewNameSeq]);

    useEffect(() => {
      if (id) {
        setGetCrewSeq(Number(id));
      }
    }, [id, setGetCrewSeq]);

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
            // gap="3px"
          >
            <Box width="70px" height="70px">
              <img src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${crewProfileImage}`} alt={`${crewProfileImage}`}></img>
            </Box>
            <Text textStyle="3xl" marginRight="10px" marginTop="15px">{crewName}</Text>
            <Box  marginTop="15px">
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
              // onClick={handleCrewApproveModal}
              onClick={() => {setOpenCrewApproveModal(true)}}
              variant="ghost" 
              color="white" 
              >
                가입 요청 확인하기
              </Button>
            }
            </Box> 
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
            <Box marginRight="3px" display="flex" gap="7px">
              <CommunityButton 
                title='글쓰기'
                onClick={goCreateArticle}
              />
              <CommunityButton
                title='음원피드 올리기'
                onClick={goCreateArticle}
              />
            </Box>
          }
          { myCrewsSeq.includes(crewNameSeq) && 
            <Box marginRight="20px">
              <CommunityButton 
                title='탈퇴하기'
                onClick={handleCrewWithdrawModal}
              />
            </Box>              
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
      {
        openCrewApproveModal &&
        <Modal
        isOpen={openCrewApproveModal}
        onClose={() => setOpenCrewApproveModal(false)}
        >
            <Box padding="5px 20px">
              <Text color="black" margin="40px">가입 신청 유저 목록</Text>
                <CommunityButton title="승인" onClick={handleCrewApproveModal} />
                <CommunityButton title="거절" onClick={handleCrewDeclineModal} />
            </Box>
          </Modal>
      }
    </>  
  );
};

export default CrewHeader;
