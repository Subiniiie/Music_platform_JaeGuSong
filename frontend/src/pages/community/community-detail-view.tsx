import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Text, Separator } from "@chakra-ui/react";
import CommunityButton from "@/components/community/community-button";
import Reviewcontainer from "@/components/community/review-container";
import Header from "@/components/community/header";
import Container from "@/components/community/container";
import paths from "@/configs/paths";
import Modal from "@/components/common/Modal";
import useCommunityDetail from "@/hooks/community/useCommunityDetail";

const CommunityDetailView: React.FC = () => {
  const { 
    openDeleteModal, 
    setOpenDeleteModal, 
    deleteArticle 
  } = useCommunityDetail();
  const [artistSeq, setArtistSeq] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [boardSeq, setBoardSeq] = useState<number>(0);
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState<string>("");
  const [sources, setSources] = useState<string[]>([]);
  const [state, setState] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [myLikedNum, setMyLikeNum] = useState<number>(0);

  const { id } = useParams<{ id: string }>();
  const API_URL = import.meta.env.VITE_API_URL;

  const authStorage = localStorage.getItem("auth-storage");
  let mySeq: number | null = null;

  if (authStorage) {
    try {
      const parsedData = JSON.parse(authStorage);
      mySeq = parsedData?.state?.artistSeq || null;
    } catch (error) {
      console.error("Failed to parse auth-storage:", error);
    }
  }
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const getArticleDetail = async () => {
      const storedToken = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get(
          `${API_URL}/api/boards/${id}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        const article = response.data;

        setArtistSeq(article.artistDto?.seq || "")
        setNickname(article.artistDto?.nickname || "");
        setProfileImage(article.artistDto?.profileImage || "");
        setBoardSeq(article.boardSeq);
        setComments(article.comments || []);
        setContent(article.content || "");
        setSources(article.sources || []);
        setState(article.state || "");
        setTitle(article.title || "");
        console.log(response.data)
      } catch (error) {
        console.error(error);
      }
    };
  
    getArticleDetail();
  }, [id]);  

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
    <Box>
      <Header />
      <Container>
        <Box>
          <Box margin="30px 30px">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box display="flex" flexDirection="row">
                <Box>
                  <img
                    width="60px"
                    height="55px" 
                    style={{ objectFit: 'fill' }}
                    src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${profileImage}`}
                  />
                </Box>                
                <Box display="flex" flexDirection="column">
                  <Text>{nickname}</Text>
                  <Text>{state}</Text>
                </Box>
              </Box>
              {/* 내 워크스페이스인지 확인 */}
              {String(artistSeq) === String(mySeq) ? (
                <Box display="flex" gap="2">
                  <CommunityButton title="수정" onClick={handleUpdateArticle} />
                  <CommunityButton title="삭제" onClick={() => setOpenDeleteModal(true)} />
                </Box>
              ) : (
                ''
              )}
            </Box>
          </Box>
          <Box height="700px" margin="20px">
            <Separator />
            <Text textStyle="2xl" margin=" 15px 0">{title}</Text>
            <Separator />
            {/* 사진 여러 개 있으면 반복문으로 받기 */}
            <Box margin="10px 25px">
              <img 
                  width="400px"
                  height="400px"   
                  style={{ objectFit: 'fill' }}
                  src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${sources[0]}`}
              />  
              <Text textStyle="1xl">{content}</Text>
            </Box>              
          </Box>  

          <Box display="flex" gap="3" marginTop="20px" marginLeft="10px">
            <CommunityButton 
              title="워크스페이스 가기" 
              onClick={goworkSpace} 
            />
            <CommunityButton
              title={`좋아요 ${myLikedNum.toString()}`}
              onClick={changeMyLiked}
            />
          </Box>
          <Reviewcontainer comments={comments} commentsLength={comments.length} />
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
      </Container>
    </Box>
  );
};

export default CommunityDetailView;
