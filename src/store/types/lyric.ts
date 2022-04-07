import { LyricData } from "@/types/lyric";

export interface Lyric {
    namespaced: true;
    state: {
        wait: boolean,
        key: number;
        plusTime: number;
        minusTime: number;
        lyric: LyricData[];
    };
    mutations: {
        setKey(state: Lyric['state'], key: number): void;
    }
}
