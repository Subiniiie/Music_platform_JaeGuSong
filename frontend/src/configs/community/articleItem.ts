export interface ArticleItem {
    board_seq: number;
    user_seq: number;
    user_nickname: string;
    user_profile_image: string;
    title: string;
    state: string;
    likeNum: number;
    isLiked: string;
    // thumbnail: File;
    thumbnail: string;
};