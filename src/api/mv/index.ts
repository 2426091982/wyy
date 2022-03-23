import http from '@/api/requset';

/**
 * 获取MV播放地址
 * @param id MVID
 */
export const getMvUrl = (id: number) => http.get('/mv/url', { id, });

/**
 * 获取MV的点赞转发评论数据
 * @param mvid MVID
 */
export const getMVInfo = (mvid: number) => http.get('/mv/detail/info', { mvid, });

/**
 * 获取MV详情
 * @param mvid MVID
 */
export const getMvDetail = (mvid: number) => http.get('/mv/detail', { mvid, }); 

/**
 * 获取相关的MV资源
 * @param mvid MVID
 */
export const getRecommmendMv = (mvid: number) => http.get('/simi/mv', { mvid, });

/**
 * 收藏MV或取消收藏
 * @param mvid 资源ID
 * @param t 1收藏 其他为取消
 * @returns 
 */
export const mvSub = (mvid: number, t = 1) => http.get('/mv/sub', { mvid, t, });
