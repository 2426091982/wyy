import { Artists } from "@/store/types/user";

export type MvUrlData = {
    code: number;
    url: string;
    r: number;
};

export type MvInfo =  { 
    commentCount: number; 
    liked: boolean;
    likedCount: number;
    shareCount: number; 
};

export type MvRecommendData = {
    artists: Artists[];
    artistId: number;
    name: string;
    artistName: string;
    id: number;
    cover: string;
    desc: string | null;
    briefDesc: string;
    playCount: number;
    duration: number;
};

export type MvDetailData = {
    artistId: number;
    artistName: number;
    artists: Artists[];
    desc: string;
    id: number;
    name: string;
    playCount: number;
    publishTime: string;
    shareCount: number;
    subCount: number;
    subed: boolean;
};
