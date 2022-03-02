import { getPlayListAll, getSongUrl } from "@/api";
import { RecommendSongsData } from "@/store/types/recommendSongs";
import { SongData } from "@/types/song";
import { parseRecommendSongs } from "../parseData";
// import { GetSongInfo } from "../types";

/* 单首音乐信息（含URL） */
const song = async (id: number): Promise<SongData> => {
    const [ songData ] = await getSongUrl(id) as SongData[];
    return songData;
};
/* 歌单音乐信息（不含URL） */
const sheet = async (id: number) => {
    let { songs, } = await getPlayListAll(id) as { songs: RecommendSongsData[] };
    songs = parseRecommendSongs(songs);
    return songs;
};

const playStrategy = {
    song,
    sheet,
};

/**
 * 播放音乐
 * @param id 音乐或歌单的ID
 * @param type song(默认值) sheet(歌单)  
 */
export const getSongInfo =  async (id: number, type = 'song') => {
    return await playStrategy[type](id);
};
