import { SongSheet } from "../types/songSheet";

const songSheet: SongSheet = {
    namespaced: true,
    state: {
        tagMame: sessionStorage.getItem('tag-name') || '全部歌单',
        tagId: Number(sessionStorage.getItem('tag-id')) || -1,
        tag: [],
        hotTag: [],
        list: [],
    },
    mutations: {
        tagMame(state, name) {
            state.tagMame = name;
            sessionStorage.setItem('tag-name', name);
        },
        add(state, list) {
            state.list.push(...list);
        },
        change(state, list) {
            state.list = list;
        },  
        tagId(state, id) {
            state.tagId = id;
            sessionStorage.setItem('tag-id', String(id));
        },
        hotTag(state, tags) {
            state.hotTag = tags;
            sessionStorage.setItem('hotTags', JSON.stringify(tags));
        },
        tag(state, tags) {
            state.tag = tags;
            sessionStorage.setItem('tags', JSON.stringify(tags));
        },
    },
};

export default songSheet;
