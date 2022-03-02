import { RecommendSongsData } from "@/store/types/recommendSongs";

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
