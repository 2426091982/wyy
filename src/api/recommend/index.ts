import http from '../requset';

// 获取轮播图
export const getBanners = () => http.get('/banner');

// 获取推荐歌单
export const getRecommendSongSheet = (limit = 9) => http.get('/personalized', { limit, });

// 获取独家放送
export const getPrivateContent = () => http.get('/personalized/privatecontent');

// 获取最新音乐
export const getNewSong = () => http.get('/personalized/newsong', { limit: 12, });

/**
 * 获取相关视频
 * @param id 视频ID
 * @returns 
 */
export const getAboutMv = (id: number) => http.get('/related/allvideo', {id, });
