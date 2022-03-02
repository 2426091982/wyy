import { RecommendSongSheet } from "../types/recommendSongSheet";

const recommendSongSheet: RecommendSongSheet = {
    namespaced: true,
    state: {
        list: [],
    },
    mutations: {
        push(state, list) {
            state.list.push(...list);
        },
    },
};

export default recommendSongSheet;
