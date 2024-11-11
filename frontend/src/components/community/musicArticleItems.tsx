import React from 'react';
import { MyMusicFeedList } from './article-music-list';
import { Text, Card, Button, Box } from '@chakra-ui/react';
import useCommunityMusic from '@/hooks/community/useCommunityMusic';

interface MusicArticleItemsProps {
    myMusic: MyMusicFeedList;
}

const MusicArticleItems: React.FC<MusicArticleItemsProps> = ({myMusic}) => {
    const {
        goMusicFeedDetail 
    } = useCommunityMusic();

    return (
        <Card.Root width="320px">
        <Card.Body gap="2">
            <Card.Title mt="2">{myMusic.name}</Card.Title>
            <Box>
            <Text>{myMusic.originSinger}</Text>
            <Text>{myMusic.originTitle}</Text>
            </Box>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
            <Button 
                variant="outline"
                onClick={() => goMusicFeedDetail(myMusic.workspaceSeq)}
            >
                보러가기
            </Button>
        </Card.Footer>
        </Card.Root>
    );
};

export default MusicArticleItems;