import { CurrentPlayList, CurrentPlayListInfo } from "../types/CurrentPlayList";

const key = 'current-play-list';
const list = JSON.parse(localStorage.getItem(key) || '[]') as CurrentPlayListInfo[];
const currentPlayList: CurrentPlayList = {
    namespaced: true,
    state: {
        list,
        total: list.length,
    },
    mutations: {
        updateState(state, data) {
            let flag = false;
            const list = state.list;
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
            state.list = [];
            state.total = 0;
            localStorage.removeItem(key);
        },
    },
};

export default currentPlayList;
