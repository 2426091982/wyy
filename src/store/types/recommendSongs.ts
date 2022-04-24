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
    alia: string[],
    al: {
        id: number;
        picUrl: string; 
        name: string;
    };
    ar: Artists[];
    br: number;
    id: string | number;
    dt: number;
    pop: number;
    pic: string;
}
