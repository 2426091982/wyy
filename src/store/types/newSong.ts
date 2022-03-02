import { Artists } from "./user";

type state = NewSong['state'];

export interface NewSong {
    namespaced: true;
    state: {
        list: NewSongData[];
    };
    mutations: {
        push: (state: state, value: state['list']) => void;
    };
}

export interface NewSongData {
    canDislike: boolean; // 可以设置不喜欢
    id: number;
    name: string;
    picUrl: string;
    song: {
        id: number;
        name: string;
        duration: number;
        artists: Artists[];
    }
}
