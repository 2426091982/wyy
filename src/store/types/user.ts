/* eslint-disable @typescript-eslint/no-explicit-any */
type Tobj = { [key: string]: any};

// 用户信息
export interface UserInfo {
    token: string;
    profile: Profile;
}
// 用户信息数据格式
export interface Profile {
    userId: number; // 用户ID
    avatarUrl: string; // 头像地址
    backgroundUrl: string; // 背景图地址
    nickname: string; // 用户名
}

// 用户动态
export interface UserEvents {
    id: number;
    type: number;
    eventTime: number;
    json: JsonData;
    info: UserEventInfo;
    user: Profile;
    pics: [{
        height: number; // 图片高
        width: number; // 图片宽
        originUrl: string; // 原始图片地址
    }];
    showComments: boolean | undefined; // 显示隐藏评论区
    comments: CommentInfo[]; // 评论数据，这是另外一个请求的数据
    play: boolean; // 是否播放
}
// 动态数据格式
export interface DyismaData {
    code: number;
    events: UserEvents[]; // 动态
    lasttime: number; // 最后一次返回的数据，下次请求带上这个字段将会返回下一页的数据
    more: boolean; // 是否还有更多
    size: number; // 大小
}
// json数据 
export interface JsonData {
    msg: string; // 描述信息
    song: {
        id: number; // 歌的ID
        name: string; //  歌名
        img80x80: string; // 背景图
        mvid: number; // 歌MV的ID
        songEvaluation: null; // 评论
        soundeffectsInfo: null; // 音效信息
        artists: Artists[], // 作家信息
        alias: string[] // 歌曲别名
    };
}

export interface Artists { // 作家
    id: number;
    name: string;
    picUrl: string;
    img1v1Url: string;
}

export interface UserEventInfo {
    commentThread: {
        likedCount: number; // 点赞数量
        resourceTitle: string; // 分享标题
    };
    threadId: string, // 资源ID
    liked: boolean, // 是否已喜欢
}

// 用户的关注
export interface FollowsData {
    code: number;
    follow: Follow[];
    more: boolean;
    size: number
}
// 当个关注对象
interface Follow {
    avatarDetail: { // 官方账号专属
        identityIconUrl: string;  // V小图标地址
    }
    avatarUrl: string; // 头像地址
    userId: number; // 用户ID
    nickname: string; // 用户名
    followed: string; // 是否关注ta
    mutual: boolean; // 是否为互相关注
    playlistCount: number; // 歌单数量
    followeds: number; // 粉丝数量
    eventCount: number; // 动态数量
    vipType: 0 | 11; // VIP类型 
    vipRights: {
        associator: {
            rights: boolean; // 是否为VIP
        };
        musicPackage: null; // 音乐包
        redVipAnnualCount: number; // 红色Vip年度总数
        redVipLevel: number; // 红色Vip等级
    } | null;
}

// 评论
export interface Comments {
    code: number;
    comments: CommentInfo[],
}

// 评论信息
export interface CommentInfo {
    commentId: number,
    beReplied: Replied[];
    user: CommentUser;
    liked: boolean;
    likedCount: number;
    content: string;
    timeStr: string;
    time: number;
}

// 回复信息
export interface Replied { 
    content: string;
    beRepliedCommentId: number; // 被回复评论的ID
    user: CommentUser;
}

// 评论的人
export interface CommentUser {
    avatarUrl: string;
    nickname: string;
    userId: number;
}

// 粉丝数据
export interface FollowedsData {
    code: number,
    followeds: [],
    more: boolean,
    newCount: number,
    size: number,
}

// 用户状态
export type UserState = {
    info: Profile | Tobj;
    dyisma: DyismaData | Tobj;
    follows: FollowsData | Tobj;
    followeds: FollowedsData | Tobj;
};

// 用户模块
export interface User {
    namespaced: true;
    state: UserState;
    mutations: {
        updateUserInfo: (state: UserState, value: Profile) => void;
        updateUserEvents: (state: UserState, value: UserState['dyisma']) => void;
    };
}
