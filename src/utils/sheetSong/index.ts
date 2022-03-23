import { getPlayListDetail } from '@/api';
import { store } from '@/store';
import { RecommendSongsData } from '@/store/types/recommendSongs';
import { SongSheetData } from '@/store/types/songSheet';
import { RecommendSongsStatic, SongData } from '@/types/song';
import { parseSongSheetInfo } from '@/utils/parseData';
import { ref } from 'vue';
import { getItem, parseArtists } from '..';
import { changePlayList, getSongInfo } from '../song';

/**
 * 歌单列表详情
 * @param sid 歌单ID
 * @returns 
 */
export const playListDetail = async (sid: number) => {
    const songSheets = store.state.playList.cacheSongSheets;
    const { playlist, } = await getPlayListDetail(sid) as { playlist: SongSheetData };
    for (let i = 0; i < songSheets.length; i++) {
        const songSheet = songSheets[i];
        if (songSheet.id === sid) return playlist; 
    }
    store.commit('playList/addCacheSongSheets', { 
        id:sid, 
        info: parseSongSheetInfo(playlist),
    });
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
