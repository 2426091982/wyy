export interface LyricSourceData {
    klyric: {
        lyric: string;
        version: number;
    };
    lrc: {
        lyric: string;
        version: number;
    },
    needDesc: true | undefined
}

export interface LyricData {
    time: number;
    lyric: string;
}

