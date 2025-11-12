export interface TreeHoleType {
    id: number;
    author: string;
    content: string;
    post_id: string;
    vote_positive: number;
    vote_negative: number;
    sub_comment_count: number;
    date_gmt: Date;
    createdAt: Date;
    ip_location: string;
    updatedAt: Date;
    images: string | null;
    author_type: number;
    user_id: number;
}

export interface AishType {
    title: string;
    articleUrl: string;
    articleId: string;
    area: string;
    isNewUserPost: boolean;
    author: string;
    replyCount: number;
    readCount: number;
    lastReplier: string;
    lastReplyTime: Date;
}

export interface StatisticsType {
    articles_posted: number;
    author: string;
    comments_received: number;
    total_dislikes: number;
    total_likes: number;
}

export enum SortEnum {
    ASC = 'ASC',
    DESC = 'DESC'
}

export enum FieldEnum {
    LIKE = 'vote_positive',
    DISLIKE = 'vote_negative',
    COMMENT = 'sub_comment_count',
    DATE = 'date_gmt',
}
export enum RangeNum {
    NoLimit = '0-∞',
    TwentyFive = '0-25',
    Fifty = '26-50',
    OneHundred = '51-100',
    TwoHundred = '101-200',
    FourHundred = '201-400',
    Infinity = '401-∞',
}

export interface UserInfo {
    username: string;
    token: string;
}

export interface QueryParams {
    page: number;
    size: number;
    sort: SortEnum;
    field: FieldEnum;
    likeRange: string;
}

export interface ApiResponse<T> {
    code: number;
    data: {
        list: T[];
        total: number;
    };
}