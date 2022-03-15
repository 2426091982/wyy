import http from '../requset';

/**
 * 获取歌单详情
 * @param id 歌单ID
 * @param s 收藏者数量，默认8
 */
export const getPlayListDetail = (id: number, s = 8) => http.get('/playlist/detail', { id, s, });
