import http from '@/api/requset';

/**
 * 
 * @param id 资源ID
 * @param type 资源类型 0歌曲 1mv 2歌单 3专辑 4电台 5视频 6动态
 * @param pageNo 分页参数
 * @param pageSize 一页多少条数据
 * @param sortType 排序方式 1推荐 2热度 3时间
 * @param cursor 当sortType为 3 时且页数不是第一页时需传入,值为上一条数据的 time
 */
export const getResourcesComment = (
    id: number, 
    type: number, 
    pageNo = 1, 
    pageSize= 20, 
    sortType = 1, 
    cursor?: number
) => {
    return http.get('/comment/new', {
        id,
        type,
        pageNo,
        pageSize,
        sortType,
        cursor,
    });
};
