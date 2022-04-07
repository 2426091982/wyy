export interface LyricSourceData {
    klyric: {
        lyric: string;
        version: number;
    };
    lrc: {
        lyric: string;
        version: number;
    }
}

export interface LyricData {
    time: number;
    lyric: string;
}

