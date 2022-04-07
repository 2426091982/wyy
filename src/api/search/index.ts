import http from '../requset';

/**
 * 搜索的默认关键词
 */
export const getDefaultSearch = () => http.get('/search/default');

/**
 * 获取热搜列表
 */
export const getHotSearchList = () => http.get('/search/hot/detail');

/**
 * 搜索提示
 */
export const getSearchSuggest = (keywords: string, type?: 'mobile') => http.get('/search/suggest', { keywords, type, });

/**
 * 
 * @param keywords 关键词
 * @param type 默认1：单曲 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音
 */
export const getSearch = (keywords: string, limit = 30, offset = 0, type = 1) => http.get('/cloudsearch', { keywords, limit, offset, type, });
