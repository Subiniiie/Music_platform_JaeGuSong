import React, { useState } from "react";
import {
  Box,
  Stack,
  Separator,
  Text,
  Input,
  Button,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";

interface ReviewcontainerProps {
  comments: any[]; // 댓글 데이터 배열
  boardSeq: number; // 게시글 번호
  onCommentAdded: () => void; // 댓글 추가 후 부모 컴포넌트에서 댓글 목록 갱신
}

const Reviewcontainer: React.FC<ReviewcontainerProps> = ({
  comments,
  boardSeq,
  onCommentAdded,
}) => {
  const [commentContent, setCommentContent] = useState<string>(""); // 일반 댓글 입력 상태
  const [replyContent, setReplyContent] = useState<string>(""); // 대댓글 입력 상태
  const [activeParentCommentSeq, setActiveParentCommentSeq] = useState<
    null | number
  >(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const storedToken = localStorage.getItem("jwtToken");
  const artistSeqData = localStorage.getItem("auth-storage");

  let artistSeq = 0;

  if (artistSeqData) {
    try {
      const parsedData = JSON.parse(artistSeqData);
      artistSeq = parsedData?.state?.artistSeq || 0;
    } catch (error) {
      console.error("유효하지 않은 사용자 정보:", error);
    }
  }

  const handleAddComment = async () => {
    if (commentContent.trim() === "") {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/boards/comments`,
        {
          artistSeq,
          boardSeq,
          content: commentContent,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setCommentContent("");
      onCommentAdded();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddReply = async (parentCommentSeq: number) => {
    if (replyContent.trim() === "") {
      alert("답글 내용을 입력해주세요.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/boards/comments`,
        {
          artistSeq,
          boardSeq,
          parentCommentSeq,
          content: replyContent,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      setReplyContent("");
      setActiveParentCommentSeq(null);
      onCommentAdded();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box marginBottom="500px">
      <Stack>
        <Separator size="xs" marginTop="20px" />
        <Text marginLeft="10px">댓글</Text>
        <Separator size="xs" />

        {comments.length === 0 ? (
          <Text marginLeft="10px">등록된 댓글이 없습니다.</Text>
        ) : (
          comments
            .filter((comment) => !comment.parentCommentSeq)
            .map((comment, index) => (
              <Box key={index} marginLeft="10px" padding="5px 0">
                <Flex justifyContent="space-between" alignItems="center">
                  <Box>
                    <Text fontWeight="bold">
                      {comment.artistSummaryDto.nickname}
                    </Text>
                    <Text>{comment.content}</Text>
                  </Box>
                  <Flex gap="10px">
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() =>
                        setActiveParentCommentSeq(comment.commentSeq)
                      }
                    >
                      답글
                    </Button>
                    {/* 수정/삭제 버튼 주석 처리 */}
                    {/* <Button size="xs" colorScheme="yellow">수정</Button>
                    <Button size="xs" colorScheme="red">삭제</Button> */}
                  </Flex>
                </Flex>
                <Separator size="xs" />

                {activeParentCommentSeq === comment.commentSeq && (
                  <Box marginTop="10px">
                    <Input
                      placeholder="답글을 입력하세요."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      marginBottom="10px"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddReply(comment.commentSeq)}
                      colorScheme="blue"
                    >
                      답글 작성
                    </Button>
                  </Box>
                )}

                {/* 대댓글 목록 */}
                {comments
                  .filter(
                    (reply) => reply.parentCommentSeq === comment.commentSeq
                  )
                  .map((reply, replyIndex) => (
                    <Box key={replyIndex} marginLeft="30px" marginTop="10px">
                      <Text fontWeight="bold">
                        {reply.artistSummaryDto.nickname}
                      </Text>
                      <Text>{reply.content}</Text>
                    </Box>
                  ))}
              </Box>
            ))
        )}

        <Box marginTop="20px">
          <Input
            placeholder="댓글을 입력하세요."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            marginBottom="10px"
          />
          <Button onClick={handleAddComment} colorScheme="blue">
            댓글 작성
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Reviewcontainer;
