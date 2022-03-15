import { CurrentMusicState } from "./currentMusic";
import { RecommendSongsData } from "./recommendSongs";
import { SongSheetData } from "./songSheet";
/* 
    后期可以添加歌曲播放的来源 
*/
export interface PlayListInfo extends CurrentMusicState {
    playTime: number;
    totalTime: string;
}

export interface PlayListState {
    playListId: number;
    index: number;
    lately: PlayListInfo[];
    cacheSongSheets: {
        id: number; 
        info: SongSheetData
    }[];
    currentList: {
        id: number; 
        songs: PlayListInfo[]
    },
    playList: PlayListInfo[], // 右侧播放列表
    total: number;
}

export interface PlayList {
    namespaced: true;
    state: PlayListState;
    mutations: {
        clearList: (state: PlayListState) => void;
        updateState: (state: PlayListState, list: PlayListInfo) => void;
        addCacheSongSheets: (state: PlayListState, playList: { id: number, info: SongSheetData}, ) => void;
        changePlayList: (state: PlayListState, playList: { songs: PlayListInfo[], size: number, id: number }) => void;
        addPlayList: (state: PlayListState, songs: PlayListInfo[]) => void;
        changeIndex: (state: PlayListState, index: number) => void;
        createCurrentList: (state: PlayListState, data: PlayListState['currentList']) => void;
        updateCurrentList: (state: PlayListState, data: PlayListInfo[]) => void;
    };
}
