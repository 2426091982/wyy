/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '../requset';
type Require =  (uid: number) => Promise<unknown>;
// 获取用户动态
export const getDynamic: Require = (uid) => http.get('/user/event', { uid, });

// 获取用户关注
export const getFollows: Require = (uid) => http.get('/user/follows', { uid, });

// 获取用户粉丝
export const getFolloweds: Require = (uid) => http.get('/user/followeds', { uid, });

// 获取动态的评论
export const getEventComment = (threadId: string) => http.get('/comment/event', {threadId, });

/**
 * 给资源点赞和取消点赞
 * @param t  0: 取消 1: 点赞
 * @param type  1: mv 4: 电台 5: 视频 6: 动态
 * @param id 资源的ID
 */
export const resourceLike = (t:number, type: number, id: string | number) => {
    const query: any = { 
        t, 
        type,
    }; 

    if (typeof id === 'string') {
        query.threadId = id;
    } else {
        query.id = id;
    }

    return http.get('/resource/like', query);
};

/**
 * 给评论点赞
 * @param id 资源ID
 * @param cid 评论ID
 * @param t 0取消 1点赞
 * @param type 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
 */
export const commentLike = (id: number | string, cid: number, t: number, type: number) => {
    const query: any = { 
        cid,
        t,
        type,
    }; 
    
    if (typeof id === 'string') {
        query.threadId = id;
    } else {
        query.id = id;
    }

    return http.get('/comment/like', query);
};
