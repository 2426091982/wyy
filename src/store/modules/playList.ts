import { PlayList, PlayListInfo } from "../types/playList";

const key = 'play-list';
const lately = JSON.parse(localStorage.getItem(key) || '[]') as PlayListInfo[];
const playList: PlayList = {
    namespaced: true,
    state: {
        lately,
        songSheets: [],
        total: lately.length,
    },
    mutations: {
        updateState(state, data) {
            let flag = false;
            const list = state.lately;
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (item.id === data.id) {
                    flag = true;
                    Object.assign(list[i], data); // 新数据合并到旧数据
                    break;
                }
            }
            if (!flag) {
                list.unshift(data);
                ++state.total;
            }
            localStorage.setItem(key, JSON.stringify(list));
        },
        clearList(state) {
            state.lately = [];
            state.total = 0;
            localStorage.removeItem(key);
        },
        addSongSheet(state, id, songSheet) {
            const songSheets = state.songSheets;
            const data = {
                id,
                songs: songSheet,
            };
            if (songSheets.length < 5) {
                songSheets.push(data);
            } else {
                songSheets.shift();
                songSheets.push(data);
            }
        },
        updateSongSheet(state, id, newData) {
            const songSheets = state.songSheets;
            for (let i = 0; i < songSheets.length; i++) {
                const songSheet = songSheets[i];
                if (songSheet.id !== id) return;
                songSheet.songs.push(...newData);
            }
        },
    },
};
/* 最近播放数据 */
export default playList;
