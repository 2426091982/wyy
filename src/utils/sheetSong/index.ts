import { getPlayListDetail } from '@/api';
import { SongSheetData } from '@/store/types/songSheet';
/**
 * 歌单列表详情
 * @param sid 歌单ID
 * @returns 
 */
export const playListDetail = async (sid: number) => {
    const { playlist, } = await getPlayListDetail(sid) as { playlist: SongSheetData };
    return playlist;
};