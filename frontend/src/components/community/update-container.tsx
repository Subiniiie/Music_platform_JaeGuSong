import React, { useEffect } from 'react'
import useCommunityUpdate from '@/hooks/community/useCommunityUpdate'
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import UpdateInputContainer from './update-input-container';

export default function UpdateContainer() {
  const { id } = useParams<{id: string}>();
  const {
    data,
    fetchArticleDetail
  } = useCommunityUpdate();

  useEffect(() => {
    if (id) { 
      const articleId = parseInt(id);
      fetchArticleDetail(articleId);

    }
  }, [id, fetchArticleDetail]);

  return (
    <Box>
      <UpdateInputContainer />
    </Box>
  )
}
