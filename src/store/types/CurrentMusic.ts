export interface CurrentMusicState {
    id: number;
    br: number;
    url: string;
    name: string;
    artists: string;
    likes: boolean;
    pic: string;
    currentTime: number;
    totalTime: number;
    play: boolean;
}

export interface CurrentMusic {
    namespaced: true;
    state: CurrentMusicState;
    mutations: {
        playSong: (state: CurrentMusicState, play: boolean) => void;
        changeState: (state: CurrentMusicState, data: CurrentMusicState) => void;
        changeTotalTime: (state: CurrentMusicState, totalTime: number) => void;
        changeCurrentTime: (state: CurrentMusicState, currentTime: number) => void;
    };
}
