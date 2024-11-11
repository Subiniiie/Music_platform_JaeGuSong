export interface ArticleItem {
    seq: number;             
    title: string;                
    state: string;
    content?: string;              
    comments?: any[];
    sources?: string[];
    artistDto?: {       
        seq: number;              
        profileImage: string;  
        nickname: string; 
    };
}
