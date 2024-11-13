// 커뮤니티에 게시글 올릴 때 필요한 데이터
export interface CreateArticleData {
    title: string;
    content: string;
    state: string;
    sources?: File | string | null;
}

export interface CreateArticleField {
    label: string;
    type: string;
    name: string;
    options?: string[];
}

export const CreateArticleFields: CreateArticleField[] = [
    {label: '제목', type: 'text', name: 'title'},
    {label: '내용', type: 'textarea', name: 'content'},
    {label: '비공개', type: 'select', name: 'state', options: ['공개', '비공개']},
    {label: '첨부 파일', type: 'file', name: 'sources'},
]
