import { SongSheet } from "../types/songSheet";

const songSheet: SongSheet = {
    namespaced: true,
    state: {
        tagName: sessionStorage.getItem('tag-name') || '全部歌单',
        tagId: Number(sessionStorage.getItem('tag-id')) || -1,
        tag: [],
        hotTag: [],
        list: [],
    },
    mutations: {
        tagName(state, name) {
            state.tagName = name;
            sessionStorage.setItem('tag-name', name);
        },
        add(state, value) {
            state.list.push(value);
        },
        change(state, list) {
            state.list = [list];
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
