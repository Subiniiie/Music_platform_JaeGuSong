import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heading , Box, Text } from '@chakra-ui/react';
import CommunityButton from '@/components/community/community-button';
import paths from '@/configs/paths';

const CommunityDetailView: React.FC = () => {
    const [ isLiked, setIsLiked ] = useState<boolean>(false);
    const [ myLikedNum, setMyLikeNum ] = useState<number>(0);
    const { id } = useParams<{id: string}>();

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
            }
        getArticleDetail();    
    }, [])

    const changeMyLiked = () => {
        const newLikedStatus = !isLiked;
        setIsLiked(newLikedStatus);
        setMyLikeNum((prevNum) => newLikedStatus ? prevNum + 1 : prevNum - 1);
    }

    const goworkSpace = async () => {
        if (!id) {
            console.error("ID is undefined");
            return;  // id가 undefined인 경우 함수 종료
        }
        const numericId = Number(id);
        navigate(paths.community.update(numericId));
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
    }

  return (
    <Box margin="40px 30px">
        <Heading as="h1" size="xl" mb={4}>
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
        <CommunityButton
            title='수정'
            onClick={handleUpdateArticle}
        />
        <CommunityButton
            title='삭제'
        />
        <Text textStyle="md">
            내용 어케 받는지 확인
        </Text>
        <CommunityButton
            title='워크스페이스 가기'
            onClick={goworkSpace}
        />
        <CommunityButton
            title={`좋아요 개수 ${myLikedNum.toString()}`}
            onClick={changeMyLiked}
            />
            {/* {myLikedNum.toString()} */}
    </Box>
  );
};

export default CommunityDetailView;