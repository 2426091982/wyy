import { 
    checkMusic, 
    getPlayListAll, 
    getSongDetail, 
    getSongUrl 
} from "@/api";
import { 
    handlePlayTime, 
    parseArtists 
} from "..";
import { store } from "@/store";
import { PlayListInfo } from "@/store/types/playList";
import { RecommendSongsData } from "@/store/types/recommendSongs";
import { SongData } from "@/types/song";
import { message } from "ant-design-vue";
import { LyricData } from "@/types/lyric";
import { parseRecommendSongs } from "../parseData"

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
export const checkSong = (id: number) => {
    return new Promise(async (resolve, reject) => {
        const { 
            success, 
            message: mes 
        } = await checkMusic(id) as { success: boolean, message: string };
        if (!success) {
            message.warn(mes + '，现为你播放下一首~');
            return reject(mes);
        }
        resolve(success);
    });
};

/**
 * 转换成可播放格式的歌曲数据
 * @param songs 歌曲数据
 * @returns 
 */
export const toPlayList = (
    songs: RecommendSongsData[] | RecommendSongsData
) => {
    const playList: PlayListInfo[] = [];
    if (!Array.isArray(songs)) {
        songs = [songs];
    }
    songs.forEach(((track) => {
        const pic = track.al ? track.al.picUrl : track.pic;
        const artists = !track.ar ?track.name : parseArtists(track.ar);
        playList.push({
            artists,
            id: track.id,
            likes: false,
            name: track.name,
            pic,
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
 * @param list 播放列表
 * @param id 播放列表ID
 * @param error 检测是否可用，错误后处理函数
 * @returns 
 */
export const playListSong = async (
    songInfo: PlayListInfo, 
    index: number, 
    list: any, 
    id: number
) => {
    if (!songInfo.url) {
        const [{ url, }] = await getSongUrl(songInfo.id) as SongData[];
        songInfo.url = url;
        if (songInfo.ar) {
            songInfo.artists = parseArtists(songInfo.ar);
        }
    }
    store.commit('playList/changeIndex', index);
    changePlayList(list, list.length, id);
    store.commit('currentMusic/changeState', songInfo);
    store.commit('currentMusic/playSong', true);
};

/**
 * 切换歌单列表
 * @param tracks 歌单
 * @param trackCount 歌曲总数
 * @param id 歌单ID
 */
export const changePlayList = (
    tracks: any, 
    trackCount: number, 
    id = -1
) => {
    if (tracks[0] && typeof (tracks[0].currentTime) !== 'string') {
        toPlayList(tracks as unknown as RecommendSongsData[])
    }
    store.commit('playList/changePlayList', { 
        songs: tracks, 
        size: trackCount,
        id,
    });
    store.commit('playList/createCurrentList', {
        id,
        songs: tracks,
    });
};

let nullLyric:LyricData[] =[{
    lyric: '暂无歌词',
    time: 0,
}];
/**
 * 将源数据转换成可识别的歌词数据
 * @param lyric 源歌词数据
 * @returns 转换完成的歌词数组
 */
export const parseLryic = (lyric: string): LyricData[] => {
    const lyricData: LyricData[] = [];
    const reg = /(\[(\d{2}):(\d{2})(.\d{2,3})?\])(.+)\n/g;
    let data: RegExpExecArray | null;
    while ((data = reg.exec(lyric)) !== null) {
        let time = 
            parseInt(data[2]) * 60 + 
            parseInt(data[3]) + 
            (parseFloat(data[4]) || 0);
        lyricData.push({
            time,
            lyric: data[5] || ' ',
        });
    }
    return lyricData.length ? lyricData : nullLyric;
};

export const setCurrentTime = (time?: number) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const audio = store.state.audio!;
    if(!audio || !audio.duration) return;
    const totalT = audio.duration;
    if (time != null)  {
        audio.currentTime = time;
    }
    const curT = Math.ceil(audio.currentTime);
    store.commit('currentMusic/changeCurrentTime', handlePlayTime(Math.min(curT, totalT)));
    const progress = (curT / totalT * 100 || 0);
    setProgress(progress);
};

/**
 * 设置当前进度条的位置
 * @param progress 位置（百分比）
 */
export const setProgress = (progress: number | string) => {
    const line = document.querySelector('#progress-play-line') as HTMLDivElement;
    const spot = document.querySelector('#spot') as HTMLSpanElement;
    if (!line || !spot) return;
    line.style.width = `${progress}%`;
    spot.style.left = `${progress}%`;
};
