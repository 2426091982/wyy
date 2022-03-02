type state =  RecommendSongSheet['state'];

export interface RecommendSongSheet {
    namespaced: true;
    state: {
        list: SongSheetData[];
    };
    mutations: {
        push:(state: state, value: state['list']) => void;
    };
}

export interface SongSheetData {
    copywriter: string; // 文案
    createTime: number; // 歌单创建时间
    creator: Creator;
    id: number;
    name: string;
    picUrl: string; // 背景图
    playcount: number; // 播放总数
    trackCount: number; // 收藏总数
}

/**
 * 歌单作者的信息 
 * */ 
export interface Creator {
    avatarImgId: number;
    avatarUrl: string; // 头像
    backgroundUrl: string;
    description: string; // 描述
    nickname: string; // 昵称
    userId: number; // 用户ID
    signature: string; // 个性签名
}
