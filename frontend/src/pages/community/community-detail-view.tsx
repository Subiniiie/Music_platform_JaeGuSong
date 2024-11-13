import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Text, Separator, Alert as ChakraAlert } from "@chakra-ui/react";
import CommunityButton from "@/components/community/community-button";
import Reviewcontainer from "@/components/community/review-container";
import CrewHeader from "@/components/community/crew-header";
import Header from "@/components/community/header";
import OtherHeader from "@/components/community/otherHeader";
import Container from "@/components/community/container";
import paths from "@/configs/paths";
import Modal from "@/components/common/Modal";
import useCommunityDetail from "@/hooks/community/useCommunityDetail";
import useHeaderStore from "@/stores/headerStore";
import { Alert } from "@/components/ui/alert"

const CommunityDetailView: React.FC = () => {
  const { openDeleteModal, setOpenDeleteModal, deleteArticle } = useCommunityDetail();
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
  const {
    openUserHeader,
    openOtherUserHeader,
    otherUserNickname,
    otherUserProfileImage,
  } = useHeaderStore((state) => state);

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
    
  }, [openUserHeader])

  const getArticleDetail = async () => {
    const storedToken = localStorage.getItem("jwtToken");
    try {
      const response = await axios.get(`${API_URL}/api/boards/${id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const article = response.data;
      setArtistSeq(article.artistDto?.seq || "");
      setNickname(article.artistDto?.nickname || "");
      setProfileImage(article.artistDto?.profileImage || "");
      setBoardSeq(article.boardSeq);
      setComments(article.comments || []);
      setContent(article.content || "");
      setSources(article.sources || []);
      setState(article.state || "");
      setTitle(article.title || "");

      const commentSeqs = article.comments.map((comment) => comment.commentSeq);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getArticleDetail();
  }, [id]);

  const changeMyLiked = () => {
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    setMyLikeNum((prevNum) => (newLikedStatus ? prevNum + 1 : prevNum - 1));
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
      {openUserHeader ? (
        openOtherUserHeader ? (
          <OtherHeader
            otherUserNickname={otherUserNickname}
            otherUserProfileImage={otherUserProfileImage}
          />
        ) : (
          <Header />
        )
      ) : (
        <CrewHeader />
      )}
      <Container>
        <Box 
          height="600px" 
          overflowY="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#6a4bff", // 보라색 계열
              borderRadius: "20px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#02001F",
              borderRadius: "20px",
            },
          }}
        >
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
                    style={{ objectFit: "fill" }}
                    src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${profileImage}`}
                  />
                </Box>
                <Box display="flex" flexDirection="column">
                  <Text>{nickname}</Text>
                  <Text>{state}</Text>
                </Box>
              </Box>
              {String(artistSeq) === String(mySeq) ? (
                <Box display="flex" gap="2">
                  <CommunityButton title="수정" onClick={handleUpdateArticle} />
                  <CommunityButton
                    title="삭제"
                    onClick={() => setOpenDeleteModal(true)}
                  />
                </Box>
              ) : (
                ""
              )}
            </Box>
          </Box>
          <Box height="700px" margin="20px">
            <Separator />
            <Text textStyle="2xl" margin=" 15px 0">
              {title}
            </Text>
            <Separator />
            <Box marginTop="30px">
              {sources.length > 0 && (
                <>
                  <img
                    width="350px"
                    height="350px"
                    style={{ objectFit: "fill" }}
                    src={`https://file-bucket-l.s3.ap-northeast-2.amazonaws.com/${sources[0]}`}
                  />
                </>
              )}
              <Text textStyle="1xl">{content}</Text>
            </Box>
          </Box>
          <Box display="flex" gap="2" marginTop="20px" marginLeft="15px">
            <CommunityButton
              title={`좋아요 ${myLikedNum.toString()}`}
              onClick={changeMyLiked}
            />
          </Box>
          <Reviewcontainer
            comments={comments}
            boardSeq={boardSeq}
            onCommentAdded={getArticleDetail} // 댓글 작성 후 댓글 목록 갱신
          />
        </Box>
      </Container>
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
  );
};

export default CommunityDetailView;
