import { checkMusic, getPlayListAll, getSongUrl } from "@/api";
import { store } from "@/store";
import { PlayListInfo } from "@/store/types/playList";
import { RecommendSongsData } from "@/store/types/recommendSongs";
import { SongData } from "@/types/song";
import { message } from "ant-design-vue";
import { handlePlayTime, parseArtists } from "..";
import { parseRecommendSongs } from "../parseData";

/* 单首音乐信息（含URL） */
export const songData = async (id: number): Promise<SongData> => {
    const [ songData ] = await getSongUrl(id) as SongData[];
    return songData;
};

/**
 * 获取歌单歌曲的数据
 * @param id 歌单ID
 * @param limit 一次获取多少条歌曲（默认20）
 * @param offset 从第几条开始获取（默认0）
 * @returns 获取到的歌曲
 */
export const getSongSheetSongsData = async (id: number, limit = 20, offset = 0) => {
    let { songs, } = await getPlayListAll(id, limit, offset) as { songs: RecommendSongsData[] };
    songs = parseRecommendSongs(songs);
    return songs;
};

const playStrategy = {
    song: songData,
    sheet: getSongSheetSongsData,
};

/**
 * 获取音乐详细信息
 * @param id 音乐或歌单的ID
 * @param type song(默认值) sheet(歌单)  
 */
export const getSongInfo =  async (id: number, type = 'song') => {
    return await playStrategy[type](id);
};

/**
 * 检测歌曲是否可用
 * @param id 歌曲ID
 * @returns 歌曲是否可用
 */
export const checkSong = async (id: number) => {
    const { success, message: mes, } = await checkMusic(id) as { success: boolean, message: string };
    if (!success) {
        message.warn(mes);
    }
    return success;
};

/**
 * 转换成可播放格式的歌曲数据
 * @param songs 歌曲数据
 * @returns 
 */
export const toPlayList = (songs: RecommendSongsData[]) => {
    const playList: PlayListInfo[] = [];
    songs.forEach(((track) => {
        const al = track.al;
        playList.push({
            artists: parseArtists(track.ar),
            id: track.id,
            likes: false,
            name: track.name,
            pic: al.picUrl,
            play: true,
            playTime: 0,
            totalTime: handlePlayTime(track.dt / 1000),
        } as PlayListInfo);
    }));
    return playList;
};


/**
 * 播放列表的音乐
 * @param songInfo 需要播放音乐的信息
 * @param index 当前音乐的索引
 * @returns 
 */
export const playListSong = async (songInfo: PlayListInfo, index: number) => {
    if (!songInfo.url) {
        // const success = await checkSong(songInfo.id);
        // if (!success) {
        //     ++index;
        //     message.info('为你自动播放下一首');
        //     console.log(index, playList.playList[index]);
        //     playListSong(playList.playList[index], index);
        //     return;
        // }
        const [{ url, }] = await getSongUrl(songInfo.id) as SongData[];
        songInfo.url = url;
        if (songInfo.ar) {
            songInfo.artists = parseArtists(songInfo.ar);
        }
    }
    
    store.commit('playList/changeIndex', index);
    store.commit('currentMusic/changeState', songInfo);
};

/**
 * 切换歌单列表
 * @param tracks 歌单
 * @param trackCount 歌曲总数
 * @param id 歌单ID
 */
export const changePlayList = (tracks: RecommendSongsData[], trackCount: number, id = -1) => {
    store.commit('playList/changePlayList', { 
        songs: id !== -1 ? toPlayList(tracks) : tracks, 
        size: trackCount,
        id,
    });
    store.commit('playList/createCurrentList', {
        id,
        songs: toPlayList(tracks),
    });
};
