import React, { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import CommunityButton2 from "@/components/community/community-button-2";
import ArticleList from "@/components/community/artice-list";
import ArticleMusicList from "@/components/community/article-music-list";
import Container from "@/components/community/container";
import Header from "@/components/community/header";
import CrewHeader from "@/components/community/crew-header";
import OtherHeader from "@/components/community/otherHeader";
import useCommunityMain from "@/hooks/community/useCommunityMain";
import axios from "axios";
import useHeaderStore from "@/stores/headerStore";

const CommunityMainView: React.FC = () => {
  const { feedState, goMusicMainFeed, goMainFeed } = useCommunityMain();
  const [ checkBoardSeq, setCheckBoardSeq ] = useState<number>(0);

  const {
    openUserHeader,
    otherUserNickname,
    otherUserProfileImage,
    setOpenUserHeader,
    setOpenOtherUserHeader,
  } = useHeaderStore((state) => state);
  const { id } = useParams<{ id: string }>();
  const API_URL = import.meta.env.VITE_API_URL;
  const [crewSeq, setCrewSeq] = useState<number>(0);
  const [checkSearchUser, setCheckSearchUser] = useState<boolean>(true);

  useEffect(() => {
    const getCrewInfoCheck = async () => {
      const storedToken = localStorage.getItem("jwtToken");

      if (id === undefined) {
        setCrewSeq(0);
      } else {
        setCrewSeq(parseInt(id));
      }
    };

    getCrewInfoCheck();
  }, [id]); // id 값이 변경될 때마다 crewSeq를 업데이트

  useEffect(() => {
    const getCrewInfo = async () => {
      const storedToken = localStorage.getItem("jwtToken");

      try {
        console.log("넌 뮤ㅓ야", crewSeq);
        const response = await axios.get(`${API_URL}/api/crew/${crewSeq}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setCheckSearchUser(false);
        setOpenUserHeader(false);
        console.log('크루 메인 화면에서 정보', response.data)
        const boardUserSeq = response.data?.crews.find((item) => item.crewUserState === "BOARD")?.seq;
        setCheckBoardSeq(boardUserSeq)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("404 오류 ㄱㅊ 넘어가");
          setCheckSearchUser(true);
          setOpenUserHeader(true);
          setOpenOtherUserHeader(true);
        } else {
          console.warn(error);
        }
      }
    };

    if (crewSeq !== 0) {
      getCrewInfo();
    }
  }, [id, crewSeq, checkBoardSeq]); // crewSeq 값이 변경될 때마다 API 요청을 보냄

  return (
    <>
      {checkSearchUser ? (
        <OtherHeader
          otherUserNickname={otherUserNickname}
          otherUserProfileImage={otherUserProfileImage}
        />
      ) : (
        // Use parentheses to ensure proper JSX rendering
        checkBoardSeq !== 0 && <CrewHeader checkBoardSeq={checkBoardSeq} />
      )}
      <Container>
        <Box margin="10px 0" overflow="auto">
          <Box display="flex" alignItems="center">
            <CommunityButton2 title="피드" onClick={goMainFeed} />
            <Text>|</Text>
            <CommunityButton2 title="음원 피드" onClick={goMusicMainFeed} />
          </Box>
          {feedState ? <ArticleList /> : <ArticleMusicList />}
        </Box>
      </Container>
    </>
  );
};  

export default CommunityMainView;
