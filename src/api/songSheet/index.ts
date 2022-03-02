import http from '../requset';

/* 获取歌单详情 */
export const getPlayListDetail = (id: number, s = 8) => http.get('/playlist/detail', { id, s, });
