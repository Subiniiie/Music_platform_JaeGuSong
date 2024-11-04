import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heading, Box, Text } from "@chakra-ui/react";
import CommunityButton from "@/components/community/community-button";
import Reviewcontainer from "@/components/community/review-container";
import Header from "@/components/community/header";
import Container from "@/components/community/container";
import paths from "@/configs/paths";
import Modal from "@/components/common/Modal";
import useCommunityDetail from "@/hooks/community/useCommunityDetail";

const CommunityDetailView: React.FC = () => {
  const { openDeleteModal, setOpenDeleteModal, deleteArticle } =
    useCommunityDetail();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [myLikedNum, setMyLikeNum] = useState<number>(0);
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  useEffect(() => {
    const getArticleDetail = async () => {
      // 토큰 가져오기
      // try {
      //     const response = await axios.get(
      //         `${API_URL}/api/boards/{id}`,
      //         {
      //             headers: {
      //               access: `${token}`,
      //             },
      //         }
      //     )
      //     const article = response.data
      // if (article.isLiked === 'LIKED') {
      //     setIsLiked(true);
      //     setMyLikeNum(article.likeNum); // API 응답에 있는 좋아요 개수
      // }
      // } catch(error) {
      //     console.error(error)
    };
    getArticleDetail();
  }, []);

  const changeMyLiked = () => {
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    setMyLikeNum((prevNum) => (newLikedStatus ? prevNum + 1 : prevNum - 1));
  };

  const goworkSpace = async () => {
    if (!id) {
      console.error("ID is undefined");
      return; // id가 undefined인 경우 함수 종료
    }
    const numericId = Number(id);
    // 워크 스페이스 url
    // navigate(paths.community.update(numericId));
    // 토큰 가져오기

    // 이걸로 workspace seq를 가지고 와서
    // try {
    //     const response = await axios.get(
    //         `${API_URL}/api/boards/workspace`,
    //     //  {
    //     //    headers: {
    //     //               access: `${token}`,
    //     //    },
    //     //  }
    //     const workspaceSeq = response.어쩌구
    //     )
    //     navigator(workspace로 갈거임)
    // } catch(error) {
    //     console.error(error)
    // }
  };

  const handleUpdateArticle = () => {
    if (!id) {
      console.error("ID is undefined");
      return;
    }

    const numericId = Number(id);
    navigate(paths.community.update(numericId));
  };

  return (
    <>
      <Header />
      <Container>
        <Box margin="40px 30px">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Heading as="h1" size="3xl" mb={4}>
              제목
              {/* {article.title} */}
            </Heading>
            {/* 내 워크스페이스인지 확인 */}
            {/* {article.user_seq === myUserSeq ? (
                        <CommunityButton
                            title='수정'
                        />
                        <CommunityButton
                            title='삭제'
                        />
                    ) : (
                        ''
                    )}; */}
            <Box display="flex" gap="2">
              <CommunityButton title="수정" onClick={handleUpdateArticle} />
              <CommunityButton
                title="삭제"
                onClick={() => setOpenDeleteModal(true)}
              />
            </Box>
          </Box>
          <Text textStyle="md" minHeight="320px">
            내용 어케 받는지 확인 꺄ㅑㅑㅑㅑㅑㅑㅑㅑㅑ
          </Text>
          <Box display="flex" gap="2">
            <CommunityButton title="워크스페이스 가기" onClick={goworkSpace} />
            <CommunityButton
              title={`좋아요 ${myLikedNum.toString()}`}
              onClick={changeMyLiked}
            />
            {/* {myLikedNum.toString()} */}
          </Box>
          <Reviewcontainer />
          {openDeleteModal && (
            <Modal
              isOpen={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
            >
              <Box padding=" 5px 20px">
                <Text color="black" margin="40px">
                  정말 이 게시물을 삭제하시겠습니까?
                </Text>
                <Box
                  margin="10px"
                  display="flex"
                  justifyContent="center"
                  gap="10px"
                >
                  <CommunityButton
                    title="삭제"
                    onClick={() => deleteArticle(Number(id))}
                  />
                  <CommunityButton
                    title="취소"
                    onClick={() => setOpenDeleteModal(false)}
                  />
                </Box>
              </Box>
            </Modal>
          )}
        </Box>
        {/* </Box> */}
        <Text textStyle="md" minHeight="320px">
          내용 어케 받는지 확인 꺄ㅑㅑㅑㅑㅑㅑㅑㅑㅑ
        </Text>
        <Box display="flex" gap="2">
          <CommunityButton title="워크스페이스 가기" onClick={goworkSpace} />
          <CommunityButton
            title={`좋아요 ${myLikedNum.toString()}`}
            onClick={changeMyLiked}
          />
          {/* {myLikedNum.toString()} */}
        </Box>
        <Reviewcontainer />
        {/* </Box> */}
      </Container>
    </>
  );
};

export default CommunityDetailView;
