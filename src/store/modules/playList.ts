import { PlayList, PlayListInfo } from "../types/playList";

const key = 'play-list';
const lately = JSON.parse(localStorage.getItem(key) || '[]') as PlayListInfo[];
const playList: PlayList = {
    namespaced: true,
    state: {
        lately, // 最近播放
        playListId: -1, // 播放中歌单的ID
        cacheSongSheets: [], // 歌单缓存区
        playList: lately, // 播放中的歌单
        currentList: { // 当前播放的列表
            id: -1,
            songs: [],
        },
        index: -1, // 当前歌曲在歌单中的索引
        total: lately.length, // 歌单歌曲总数
    },
    mutations: {
        updateState(state, data) {
            let flag = false;
            const list = state.lately;
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (i === 99 && item.id !== data.id) {
                    list.pop();
                    break; // 限制最近播放最多100条数据
                }
                if (item.id === data.id) {
                    flag = true;
                    Object.assign(list[i], data); // 新数据合并到旧数据
                    list.unshift(...list.splice(i, 1)); // 将播放的数据移动到第一条
                    break;
                }
            }
            if (!flag) {
                list.unshift(data); // 新增数据
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
        updateCacheSongSheets(state, { id, songs, }) {
            const songSheets = state.cacheSongSheets;
            for (let i = 0; i < songSheets.length; i++) {
                const songSheet = songSheets[i];
                if (id === songSheet.id) {
                    songSheet.info.tracks.push(...songs);
                    break;
                }
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
