import { RecommendSongsData } from "./recommendSongs";

type state =  SongSheet['state'];

export interface SongSheet {
    namespaced: true;
    state: {
        tagMame: string;
        tagId: number;
        tag: Tags[];
        hotTag: Tags[];
        list: SongSheetData[]; // 所有歌单信息
        // songSheetInfo 单项歌单详细信息
    };
    mutations: {
        tagMame: (state: state, name: string) => void;
        add: (state: state, value: state['list']) => void;
        change:(state: state, value: state['list']) => void;
        tagId: (state: state, id: number) => void;
        tag: (state: state, tag: Tags[]) => void;
        hotTag: (state: state, tag: Tags[]) => void;
    };
}

export interface RecommentSongSheetData {
    copywriter: string;
    id: number;
    name: string;
    picUrl: string;
    playCount: number;
    trackCount: number;
    
}

/* 歌单信息 */
export interface SongSheetData {
    creator: Creator;
    id: number;
    name: string;
    userId: number;
    tags: string[]; // 标签分类
    copywriter: string; // 文案
    createTime: number; // 歌单创建时间
    coverImgUrl: string;
    picUrl: string; // 背景图
    playcount: number; // 播放总数
    trackCount: number; // 歌单的音乐总数
    tracks: RecommendSongsData[]; // 歌单的歌曲
    subscribed: boolean; // 是否收藏
    subscribedCount: number; // 收藏总数
    shareCount: number; // 分享总数
    playCount: number; // 播放总数
    description: string; // 歌单简介
}

/**
 * 歌单作者的信息 
 */ 
export interface Creator {
    avatarImgId: number;
    avatarUrl: string; // 头像
    backgroundUrl: string;
    description: string; // 描述
    nickname: string; // 昵称
    userId: number; // 用户ID
    signature: string; // 个性签名
}

/**
 * 歌单分类标签
 */
export interface Tags {
    activity: boolean;
    category: number;
    createTime: number;
    hot: boolean;
    id: number;
    name: string;
    playlistTag: PlaylistTag,
    position: number;
    type: number;
    usedCount: number; // 计数
}

export interface PlaylistTag {
    category: number;
    createTime: number;
    highQuality: number;
    highQualityPos: number;
    id: number;
    name: string;
    officialPos: number;
    position: number;
    usedCount: number;
}

export interface Tag {
    activity: boolean;
    category: number;
    hot: boolean;
    imgId: number;
    imgUrl: null | string;
    name: string;
    resourceCount: number;
    resourceType: number;
    type: number;
}

export interface TagsData {
    all: Tag;
    categories: string[];
    sub: Tag[];
}
