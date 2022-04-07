import { RecommendSongsData } from "@/store/types/recommendSongs";
import { Artists } from "@/store/types/user";

/* 歌曲信息 */
export interface SongData {
    id: number;
    br: number;
    url: string;
    type: string;
    size: number;
}

/* 每日推荐歌曲 */
export interface RecommendSongsStatic {
    songs: RecommendSongsData[];
    setTime: number;
    day: number;
}

export interface LatesMusic {
    artists: Artists[],
    disc: string;
    duration: number;
    id: number;
    name: string;
    album: {
        blurPicUrl: string;
        picUrl: string;
        name: string;
        id: number;
    };
}
