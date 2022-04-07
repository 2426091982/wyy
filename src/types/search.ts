import { RecommendSongsData } from "@/store/types/recommendSongs";
import { Artists } from "@/store/types/user";
import { LatesMusic } from "./song";

/**
 * 搜索默认关键字
 */
export interface SearchDefault {
    bizQueryInfo: string;
    realkeyword: string;
    showKeyword: string;
}

/**
 * 热搜列表数据
 */
export interface SearchHotData {
    content: string;
    iconUrl: string;
    searchWord: string;
    score: number;
    iconType: number;
}

/**
 * PC端搜索提示
 */
export interface SearchTipsData {
    result: {
        albums: { // 专辑
            artist: Artists
            copyrightId: number;
            id: number;
            name: string;
            size: number;
        }[];
        artists: Artists[]; // 作家
        songs: LatesMusic[]; // 单曲
    };
}

/**
 * 手机端搜索提示
 */
export interface MobileSearchTipsData {
    result: {
        allMatch: {
            keyword: string;
            lastKeyword: string;
        }[];
    };
}

type Result = SearchTipsData['result'];

/**
 * 搜索提示列表
 */
export interface SearchTipsListData {
    allMatch: string[];
    albums: Result['albums'];
    artists: Result['artists'];
    songs: {
        name: string;
        artist: string;
    }[]
}

export interface SearchReslute {
    result: {
        songs: RecommendSongsData[];
        songCount: number;
        hasMore: boolean;
    };
}
