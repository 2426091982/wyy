import http from '../requset';

/* 检测音乐是否可用 */
export const checkMusic = (id: number) => {
    return http.get('/check/music', {id, });
};

/* 获取音乐地址 */
export const getSongUrl = (id: number) => {
    return http.get('/song/url', { id, });
};

/* 获取歌词 */
export const getLyric = (id: number) => {
    return http.get('/lyric', { id, });
};

/* 获取每日推荐音乐 */
export const getRecommendSongs = () => http.get('/recommend/songs');

/* 获取歌单歌曲 */
export const getPlayListAll = (id: number, limit = 20, offset = 0) => http.get('/playlist/track/all', { id, limit, offset, });

/**
 * 新歌速推
 */
export const getTopSong = (type: number) => http.get('/top/song', { type, });
