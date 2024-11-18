import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Text,
  Input,
  Button,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import axios from "axios";
import useAuthStore from "@/stores/authStore";
import useReviewStore from "@/stores/review";

interface ReviewcontainerProps {
  comments: any[]; // 댓글 데이터 배열
  boardSeq: number; // 게시글 번호
  onCommentAdded: () => void; // 댓글 추가 후 부모 컴포넌트에서 댓글 목록 갱신
}

interface Comment {
  id: number;
  content: string;
  replies: Reply[];
}

interface Reply {
  id: number;
  content: string;
}

const Reviewcontainer: React.FC<ReviewcontainerProps> = ({
  comments,
  boardSeq,
  onCommentAdded,
}) => {
  const [commentContent, setCommentContent] = useState<string>(""); // 일반 댓글 입력 상태
  const [replyContent, setReplyContent] = useState<string>(""); // 대댓글 입력 상태
  const [activeParentCommentSeq, setActiveParentCommentSeq] = useState<null | number>(null);
  const [openReviewUpdateInput, setOpenReviewUpdateInput] = useState<null | number>(null);
  const artistNickname = useAuthStore((state) => state.artistNickname);

  const { changeReview, setChangeReview } = useReviewStore();

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
      setCommentContent(""); // 댓글 작성 후 텍스트 영역 초기화
      onCommentAdded(); // 댓글 추가 후 부모 컴포넌트에서 댓글 목록 갱신
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

      setReplyContent(""); // 답글 작성 후 텍스트 영역 초기화
      setActiveParentCommentSeq(null); // 답글 입력 모드 종료
      onCommentAdded(); // 댓글 목록 갱신
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewDelete = async (commentSeq: number) => {
    try {
      console.log('댓글 지울거', commentSeq)
      const response = await axios.delete(
        `${API_URL}/api/boards/comments/${commentSeq}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      )
      console.log('댓글 지웟다')
      setChangeReview(!changeReview)
    } catch(error) {
      console.error(error)
    }
  }
  
  const handleReviewUpdate = async (commentSeq: number) => {
    setOpenReviewUpdateInput(commentSeq)
  };
  
  const submitReviewUpdate = async (commentSeq: number) => {
    console.log('댯글 바꾸고 싶다, commentSeq, artisSeq, boardSeq, content', commentSeq, artistSeq, boardSeq, commentContent)
    try {
      await axios.put(
        `${API_URL}/api/boards/comments/${commentSeq}`,
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
      console.log('댓글 수정 완료')
      setOpenReviewUpdateInput(null);
      setChangeReview(!changeReview)
    } catch(error) {
      console.error(error)
    }
  };

  useEffect(() => {
  }, [changeReview])



  return (
    <Box marginTop="30px">
      <Text fontWeight="bold" marginBottom="10px" color="#7e5cc6">
        댓글 목록
      </Text>
      <Box marginTop="10px" padding="15px">
        {comments.length === 0 ? (
          <Text marginLeft="10px" color="white">등록된 댓글이 없습니다.</Text>
        ) : (
          comments
            .filter((comment) => !comment.parentCommentSeq)
            .map((comment, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection="column"
                borderBottom="1px solid #7e5cc6"
                paddingBottom="15px"
                marginBottom="15px"
                color="white"
                
              >
                <Box             
                  borderRadius="8px"
                  bg="gray.600"
                  _hover={{ bg: 'gray.700' }}
                >
                  <Flex alignItems="center" gap="12px" marginBottom="12px" padding="8px" borderRadius="8px"  transition="background-color 0.3s" justifyContent="space-between">
                    <Box display="flex" flexDirection="row" gap="5px">
                      <Box width="35px" height="35px" borderRadius="full" overflow="hidden">
                        <img src={`/assets/review/0.png`} alt="Profile" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                      </Box>
                      <Box marginTop="10px">
                        <Text fontWeight="bold" color="white" fontSize="lg" lineHeight="short">
                          {comment.artistSummaryDto.nickname}
                        </Text>
                      </Box>
                    </Box>
                    {artistNickname === comment.artistSummaryDto.nickname &&
                        <Box display="flex" gap="5px">
                          <Button
                            size="xs" // 버튼 크기 작게 설정
                            colorScheme="gray" // 은은한 색상 (회색)
                            variant="solid" // 배경색을 주는 스타일
                            backgroundColor="gray.300" // 부드러운 회색 배경색
                            color="gray.700" // 텍스트 색상
                            _hover={{
                              bg: "gray.400", // 호버 시 부드러운 배경색 변화
                              color: "white", // 호버 시 텍스트 색상 변경
                            }}
                            _active={{
                              bg: "gray.500", // 클릭 시 배경색
                              color: "white", // 클릭 시 텍스트 색상 변경
                            }}
                            _focus={{
                              boxShadow: "0 0 0 3px rgba(150, 150, 150, 0.6)", // 포커스 시 부드러운 그림자
                            }}
                            onClick={() => handleReviewUpdate(comment.commentSeq)}
                          >
                            수정
                          </Button>
                          <Button
                            size="xs" // 버튼 크기 작게 설정
                            colorScheme="red" // 은은한 붉은색
                            variant="solid" // 배경색을 주는 스타일
                            backgroundColor="red.300" // 부드러운 붉은색 배경색
                            color="white" // 텍스트 색상
                            _hover={{
                              bg: "red.400", // 호버 시 배경색 변화
                              color: "white", // 호버 시 텍스트 색상 변경
                            }}
                            _active={{
                              bg: "red.500", // 클릭 시 배경색
                              color: "white", // 클릭 시 텍스트 색상 변경
                            }}
                            _focus={{
                              boxShadow: "0 0 0 3px rgba(255, 99, 71, 0.4)", // 포커스 시 부드러운 그림자
                            }}
                            onClick={() => handleReviewDelete(comment.commentSeq)}
                          >
                            삭제
                          </Button>
                        </Box>
                    }
                  </Flex>
                  <Box display="flex" flexDirection="row">
                    {openReviewUpdateInput === comment.commentSeq ? (
                      <>
                        <Input
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          placeholder="댓글을 수정하세요."
                          size="sm"
                        />
                        <Button onClick={() => submitReviewUpdate(comment.commentSeq)}>수정 완료</Button>
                        <Button onClick={() => setOpenReviewUpdateInput(null)}>수정 취소</Button>
                      </>
                    ) : (
                      <Text color="gray.300" fontSize="md" lineHeight="tall" paddingX="8px" marginBottom="30px">
                        {comment.content}
                      </Text>
                    )} 
                    <Button
                      size="xs"
                      colorScheme="blue"
                      variant="ghost"
                      // backgroundColor="blue.200" // 부드러운 파란색 배경
                      color="black" // 폰트 색상을 흰색으로 설정
                      // marginTop="5px"
                      marginTop= "-2px"
                      // marginLeft="5px"
                      marginLeft="-2px"
                      onClick={() => setActiveParentCommentSeq(comment.commentSeq)}
                    >
                      💬답글
                    </Button>
                  </Box>
                </Box> 
                {activeParentCommentSeq === comment.commentSeq && (
                  <Box marginTop="16px" paddingLeft="40px" paddingRight="16px" borderLeft="2px solid" borderColor="blue.500">
                    <Input
                      placeholder="답글을 입력하세요."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      marginBottom="12px"
                      size="md"
                      borderColor="blue.500"
                      _focus={{
                        borderColor: 'blue.600',
                        boxShadow: '0 0 0 1px rgba(66,153,225,0.6)',
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddReply(comment.commentSeq)}
                      colorScheme="blue"
                      width="100%"
                      _hover={{ bg: 'blue.600' }}
                      _active={{ bg: 'blue.700' }}
                    >
                      답글 작성
                    </Button>
                  </Box>
                )}
                {/* 대댓글 목록 */}
                {comments
                  .filter((reply) => reply.parentCommentSeq === comment.commentSeq)
                  .map((reply, replyIndex) => (
                    <Box
                      key={replyIndex}
                      marginLeft="60px"
                      marginTop="12px"
                      padding="12px"
                      borderRadius="8px"
                      bg="gray.700"
                      _hover={{ bg: 'gray.600' }}
                      transition="background-color 0.3s"
                    >
                      <Flex alignItems="center" gap="12px" marginBottom="12px" padding="8px" borderRadius="8px"  transition="background-color 0.3s" justifyContent="space-between">
                        <Box display="flex" flexDirection="row" gap="5px">
                          <Box
                            width="35px"
                            height="35px"
                            borderRadius="full"
                            overflow="hidden"
                            boxShadow="0 0 8px rgba(0, 0, 0, 0.2)"
                            marginTop="-8px" 
                          >
                            <img
                              src={`/assets/review/3.png`}
                              alt="Profile"
                              style={{ objectFit: 'cover', width: '100%', height: '100%'}}
                            />
                          </Box>
                          <Text fontWeight="bold" color="white" fontSize="lg" lineHeight="short">
                            {reply.artistSummaryDto.nickname}
                          </Text>
                        </Box>
                        {artistNickname === reply.artistSummaryDto.nickname &&
                          <Box display="flex" gap="5px">
                            <Button
                              size="xs" // 버튼 크기 작게 설정
                              colorScheme="gray" // 은은한 색상 (회색)
                              variant="solid" // 배경색을 주는 스타일
                              backgroundColor="gray.300" // 부드러운 회색 배경색
                              color="gray.700" // 텍스트 색상
                              _hover={{
                                bg: "gray.400", // 호버 시 부드러운 배경색 변화
                                color: "white", // 호버 시 텍스트 색상 변경
                              }}
                              _active={{
                                bg: "gray.500", // 클릭 시 배경색
                                color: "white", // 클릭 시 텍스트 색상 변경
                              }}
                              _focus={{
                                boxShadow: "0 0 0 3px rgba(150, 150, 150, 0.6)", // 포커스 시 부드러운 그림자
                              }}
                              onClick={() => handleReviewUpdate(reply.commentSeq)}
                            >
                              수정
                            </Button>
                            <Button
                              size="xs" // 버튼 크기 작게 설정
                              colorScheme="red" // 은은한 붉은색
                              variant="solid" // 배경색을 주는 스타일
                              backgroundColor="red.300" // 부드러운 붉은색 배경색
                              color="white" // 텍스트 색상
                              _hover={{
                                bg: "red.400", // 호버 시 배경색 변화
                                color: "white", // 호버 시 텍스트 색상 변경
                              }}
                              _active={{
                                bg: "red.500", // 클릭 시 배경색
                                color: "white", // 클릭 시 텍스트 색상 변경
                              }}
                              _focus={{
                                boxShadow: "0 0 0 3px rgba(255, 99, 71, 0.4)", // 포커스 시 부드러운 그림자
                              }}
                              onClick={() => handleReviewDelete(reply.commentSeq)}
                            >
                              삭제
                            </Button>
                          </Box>
                        }
                      </Flex>
                      {openReviewUpdateInput === reply.commentSeq ? (
                      <>
                        <Input
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          placeholder="댓글을 수정하세요."
                          size="sm"
                        />
                        <Button onClick={() => submitReviewUpdate(reply.commentSeq)}>수정 완료</Button>
                        <Button onClick={() => setOpenReviewUpdateInput(null)}>수정 취소</Button>
                      </>
                    ) : (
                      <Text color="gray.300" fontSize="md" lineHeight="tall" marginTop="8px">
                        {reply.content}
                      </Text>
                    )}
                    </Box>
                  ))}
              </Box>
            ))
        )}
        <Text fontWeight="bold" marginTop="20px" color="#7e5cc6">
          댓글 작성
        </Text>
        <Box padding="15px" borderRadius="8px">
          <textarea
            rows={4}
            placeholder="댓글을 작성해주세요"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #6a4bff", // 차분한 보라색 테두리
              marginBottom: "10px",
              backgroundColor: "#FFFFFF",
              color: "#333", // 텍스트 색상은 어두운 회색
              fontSize: "16px",
              fontFamily: "Arial, sans-serif",
            }}
            value={commentContent} // 상태와 연결
            onChange={(e) => setCommentContent(e.target.value)} // onChange 이벤트 핸들러
          />
          <Button onClick={handleAddComment} colorScheme="purple">
            댓글 작성
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Reviewcontainer;
