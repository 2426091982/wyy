import { getPlayListDetail } from '@/api';
import { store } from '@/store';
import { RecommendSongsData } from '@/store/types/recommendSongs';
import { SongSheetData } from '@/store/types/songSheet';
import { RecommendSongsStatic, SongData } from '@/types/song';
import { ref } from 'vue';
import { getItem, parseArtists, stop } from '..';
import { changePlayList, getSongInfo } from '../song';

/**
 * 歌单列表详情
 * @param sid 歌单ID
 * @returns 
 */
export const playListDetail = async (sid: number) => {
    const { playlist, } = await getPlayListDetail(sid) as { playlist: SongSheetData };
    return playlist;
};

type Type = 'song' | 'sheet';
const recommendSongs = getItem('recommend-songs') as RecommendSongsStatic;
const rSong = ref<RecommendSongsData[]>(recommendSongs?.songs || []);
export const playSong = async (sid: number, stype: Type, songs = rSong.value, recommend = true) => {
    if (recommend) {
        // 每日推荐歌曲的列表
        changePlayList(songs, songs.length);
    }

    const index = 0;
    const {
        al,
        ar,
        name,
    } = songs[index];
    
    const {
        br,
        id,
        url,
    } = await getSongInfo(sid, stype) as SongData;
    store.commit('currentMusic/changeState', {
        artists: parseArtists(ar),
        br,
        id,
        likes: false,
        name,
        pic: al.picUrl,
        play: true,
        url,
    });
    store.commit('playList/changeIndex', index);
};

let prevSongId = -1;
export const querySong = async (sid: number, type: Type, e: Event) => {
    stop(e);
    if (prevSongId === sid) {
        store.commit('currentMusic/playSong', !store.state.currentMusic.play);
        return;
    }
    const data = await getSongInfo(sid, type) as RecommendSongsData[];
    await playSong(+data[0].id, 'song', data, false);
    const playList = await playListDetail(sid);
    prevSongId = sid;
    changePlayList(playList.tracks, playList.trackCount, sid);
};
