import { CurrentMusicState } from "./CurrentMusic";
/* 
    后期可以添加歌曲播放的来源 
*/
export interface CurrentPlayListInfo extends CurrentMusicState {
    playTime: number;
    totalTime: string;
}

export interface CurrentPlayListState {
    list: CurrentPlayListInfo[];
    total: number;
}

export interface CurrentPlayList {
    namespaced: true;
    state: CurrentPlayListState;
    mutations: {
        clearList: (state: CurrentPlayListState) => void;
        updateState: (state: CurrentPlayListState, list: CurrentPlayListInfo) => void;
    };
}
