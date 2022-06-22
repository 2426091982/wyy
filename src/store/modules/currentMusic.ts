import type { CurrentMusic } from "../types/currentMusic";

/* 存放当前歌曲状态 */
const currentMusic: CurrentMusic = {
    namespaced: true,
    state: {
        id: 0,
        url: '',
        pic: '',
        name: '',
        br: 1200,
        artists: '',
        likes: false,
        play: false,
        currentTime: '00:00',
        totalTime: '00:00',
    },
    mutations: {
        playSong(state, isPlay) {
            state.play = isPlay;
        },
        changeState(state, newData) {
            Object.assign(state, newData);
        },
        changeCurrentTime(state, currentTime) {
            state.currentTime = currentTime;
        },
        changeTotalTime(state, totalTime) {
            state.totalTime = totalTime;
        },
        clearState(state) {
            // 重置数据
            state.id = 0,
            state.url = '';
            state.pic = '';
            state.name = '';
            state.br = 1200;
            state.artists = '';
            state.likes = false;
            state.play = false;
            state.currentTime = '00:00';
            state.totalTime = '00:00';
        },
    },
};

export default currentMusic;
