import { NewSong } from "../types/newSong";

const newSong: NewSong = {
    namespaced: true,
    state: {
        list: [],
    },
    mutations: {
        push(state, value) {
            state.list = value;
        },
    },
};

export default newSong;
