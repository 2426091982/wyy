import { CurrentMusicState } from "./currentMusic";
import { RecommendSongsData } from "./recommendSongs";
/* 
    后期可以添加歌曲播放的来源 
*/
export interface PlayListInfo extends CurrentMusicState {
    playTime: number;
    totalTime: string;
}

export interface SongSheetItem {
    songs: RecommendSongsData[];
    total: number;
    creatTime: number;
}

export interface PlayListState {
    lately: PlayListInfo[];
    songSheets: {
        id: number; 
        songs: SongSheetItem[];
    }[];
    total: number;
}

export interface PlayList {
    namespaced: true;
    state: PlayListState;
    mutations: {
        clearList: (state: PlayListState) => void;
        updateState: (state: PlayListState, list: PlayListInfo) => void;
        addSongSheet: (state: PlayListState, id: number, songSheet: SongSheetItem[]) => void;
        updateSongSheet: (state: PlayListState, id: number, newData: SongSheetItem[]) => void;
    };
}
