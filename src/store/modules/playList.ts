import { PlayList, PlayListInfo } from "../types/playList";
import { SongSheetData } from "../types/songSheet";

const key = 'play-list';
const lately = JSON.parse(localStorage.getItem(key) || '[]') as PlayListInfo[];
const playList: PlayList = {
    namespaced: true,
    state: {
        lately,
        playListId: -1,
        cacheSongSheets: [],
        playList: lately,
        currentList: {
            id: -1,
            songs: [],
        },
        index: -1,
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
                if (state.playListId === -1) {
                    ++state.total;
                }
            }
            localStorage.setItem(key, JSON.stringify(list));
        },
        clearList(state) {
            state.playList = [];
            state.total = 0;
            localStorage.removeItem(key);
        },
        addCacheSongSheets(state, { id,  info, }) {
            const songSheets = state.cacheSongSheets;
            const data = {
                id,
                info,
            };
            if (songSheets.length < 5) {
                songSheets.push(data);
            } else {
                songSheets.shift();
                songSheets.push(data);
            }
        },
        changePlayList(state, playList) {
            state.playList = playList.songs;
            state.playListId = playList.id;
            state.total = playList.size;
        },
        addPlayList(state, songs) {
            state.playList.push(...songs);
        },
        changeIndex(state, index) {
            state.index = index;
        },
        createCurrentList(state, data) {
            state.currentList = data;
        },
        updateCurrentList(state, data) {
            state.currentList.songs.push(...data);
        },
    },
};
/* 
 * 最近播放数据
 * 管理最近播放过的歌单 歌单列表
 */
export default playList;
