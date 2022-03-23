import http from '../requset';

/**
 * 获取歌单详情
 * @param id 歌单ID
 * @param s 收藏者数量，默认8
 */
export const getPlayListDetail = (id: number, s = 8) => http.get('/playlist/detail', { id, s, });

/**
 * 获取精品歌单类型的数据
 * @param cat 歌单类型标签 例如：华语，欧美
 * @param limit 一次数据多少条
 * @param before 上次最后一条数据中的updateTime
 */
export const getTopPlaylistHighquality = (cat: string, limit = 20, before?: number) => {
    return http.get('/top/playlist/highquality', { cat, limit, before, });
};

/**
 * 获取歌单对应类型的数据
 * @param cat 歌单类型标签 例如：华语，欧美
 * @param limit 一次数据多少条
 * @param offset 偏移量
 * @param order new 和 hot
 */
export const getTopPlaylist = (cat: string, limit = 20, offset?: number, order = 'hot') => {
    return http.get('/top/playlist', { cat, limit, offset, order, });
};

/**
 * 获取歌单分类标签
 */
export const getPlaylistCatlist = () => http.get('/playlist/catlist');

/**
 * 获取热门歌单分类标签
 */
export const getPlaylistHot = () => http.get('/playlist/hot');
