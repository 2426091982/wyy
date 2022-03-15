import { Artists } from "./user";

type state = RecommendSongs['state'];

export interface RecommendSongs {
    namespaced: true;
    state: {
        songs: RecommendSongsData[];
    };
    mutations: {
        change: (state: state, value: state['songs']) => void;
    };
}


export interface RecommendSongsData {
    name: string;
    al: {
        id: number;
        picUrl: string; 
    };
    ar: Artists[];
    br: number;
    id: string | number;
    dt: number;
}
