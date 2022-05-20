import http from '../requset';

/* 检测音乐是否可用 */
export const checkMusic = (id: number) => {
    return http.get('/check/music', {id, });
};

/* 获取音乐地址 */
export const getSongUrl = <T>(id: number) => {
    return http.get<T>('/song/url', { id, });
};

/* 获取歌词 */
export const getLyric = (id: number) => {
    return http.get('/lyric', { id, });
};

/* 获取每日推荐音乐 */
export const getRecommendSongs = () => http.get('/recommend/songs');

/* 获取歌单歌曲 */
export const getPlayListAll = <T>(id: number, limit = 20, offset = 0) => http.get<T>('/playlist/track/all', { id, limit, offset, });

/**
 * 新歌速推
 */
export const getTopSong = (type: number) => http.get('/top/song', { type, });

/**
 * 获取歌曲详情
 * @param ids 音乐ID
 * @returns 
 */
export const getSongDetail = (ids: number) => http.get('/song/detail', {ids});
