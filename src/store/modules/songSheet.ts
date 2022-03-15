import { SongSheet } from "../types/songSheet";

const songSheet: SongSheet = {
    namespaced: true,
    state: {
        list: [],
    },
    mutations: {
        add(state, list) {
            state.list.push(...list);
        },
        change(state, list) {
            state.list = list;
        },
    },
};

export default songSheet;
