import { Lyric } from "../types/lyric";

const lyric: Lyric = {
    namespaced: true,
    state: {
        wait: false,
        plusTime: 0,
        minusTime: 0,
        key: 0,
        lyric: [],
    },
    mutations: {
        setKey(state, key) {
            state.key = key;
        },
    },
};

export default lyric;
