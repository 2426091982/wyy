import http from '../requset';

export const checkMusic = (id: number) => {
    return http.get('/check/music', {id, });
};

export const getSongUrl = (id: number) => {
    return http.get('/song/url', { id, });
};

export const getLyric = (id: number) => {
    return http.get('/lyric', { id, });
};
