<script lang='ts' setup>
import { 
    getBanners, 
    getNewSong, 
    getPrivateContent, 
    getRecommendSongSheet 
} from '@/api/recommend';
import { 
    onMounted, 
    ref 
} from '@vue/runtime-core';
import { Banners } from '@/types/base';
import { 
    parseBannerData, 
    parseNewSongData, 
    parseRecommendSongs, 
    parseSongSheetData, 
    parseSongSheetInfo
} from '@/utils/parseData';
import { 
    CaretRightOutlined, 
    PlayCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons-vue';
import { 
    day, 
    getItem, 
    parseArtists, 
    parsePlayCount, 
    stop
} from '@/utils';
import { 
    changePlayList,
    getSongInfo
} from '@/utils/song';
import { 
    RecommendSongsStatic, 
    SongData 
} from '@/types/song';
import { SongSheetData } from '@/store/types/songSheet';
import { useStore } from '@/store';
import { PrivateContentData } from '@/store/types/privateContent';
import { NewSongData } from '@/store/types/newSong';
import { getRecommendSongs } from '@/api';
import { Response } from '@/types/base';
import { RecommendSongsData } from '@/store/types/recommendSongs';
import { getPlayListDetail } from '@/api/songSheet';
import Banner from '@/components/banner.vue';
import Title from '@/components/title.vue';
import PrivateContentCard from '@/components/privateContentCard.vue';
import Loading from '@/components/loading.vue';

type Type = 'song' | 'sheet';

const nowDay = day();
const store = useStore();
const loading = ref(true);
const songSheet = ref<SongSheetData[]>([]);
const privateContent = store.state.privateContent.list;
const newSong = store.state.newSong.list;
const recommendSongs = getItem('recommend-songs') as RecommendSongsStatic;
const rSong = ref<RecommendSongsData[]>(recommendSongs?.songs || []);
const bannerData = ref<Banners>([]);

let prevSongId = -1;
// 播放音乐
let playSong = async (sid: number, stype: Type, songs = rSong.value, recommend = true) => {
    if (recommend) {
        // 每日推荐歌曲的列表
        changePlayList(songs, songs.length);
    }
    const index = 0;
    let {
        al,
        ar,
        name,
    } = songs[index];
    let {
        br,
        id,
        url,
    } = await getSongInfo(sid, stype) as SongData;
    store.commit('currentMusic/changeState', {
        artists: parseArtists(ar),
        br,
        currentTime: '00:00',
        id,
        likes: false,
        name,
        pic: al.picUrl,
        play: true,
        url,
    });
    store.commit('playList/changeIndex', index);
};

// 获取列表的前20首歌
let querySong = async (sid: number, type: Type, e: Event) => {
    stop(e);
    if (prevSongId === sid) {
        store.commit('currentMusic/playSong', !store.state.currentMusic.play);
        return;
    }
    const data = await getSongInfo(sid, type) as RecommendSongsData[];
    await playSong(+data[0].id, 'song', data, false);
    const { playlist, } = await getPlayListDetail(sid) as { playlist: SongSheetData };
    store.commit('playList/addCacheSongSheets', { 
        id:sid, 
        info: parseSongSheetInfo(playlist),
    });
    prevSongId = sid;
    changePlayList(playlist.tracks, playlist.trackCount, sid);
};

onMounted(async () => {
    {   // 轮播图
        let { 
            code, 
            banners, 
        } = await getBanners() as Response & { banners: Banners };
        if (code === 200) {
            bannerData.value = parseBannerData(banners).splice(0, 8);
        }
    }
    {   // 推荐歌单
        let { 
            code, 
            recommend, 
        } =  await getRecommendSongSheet() as Response & { recommend: SongSheetData[] };
        if (code === 200) {
            recommend = parseSongSheetData(recommend);
            songSheet.value.push(...recommend.splice(0, 9));
            store.commit('songSheet/add', recommend);
        }
    }
    {   // 独家放送
        let { 
            code, 
            result, 
        } = await getPrivateContent() as Response & { result: PrivateContentData[] };
        if (code === 200) {
            store.commit('privateContent/push', result);
        }
    }
    {   // 最新歌曲
        let { 
            code, 
            result, 
        } = await getNewSong() as Response & { result: NewSongData[] };
        if (code === 200) {
            store.commit('newSong/push', parseNewSongData(result));
        }
    }
    {   // 获取每日推荐歌曲
        if (!recommendSongs || recommendSongs.day != nowDay) {
            let { 
                dailySongs,
            } = await getRecommendSongs() as{ dailySongs: RecommendSongsData[] };
            dailySongs = parseRecommendSongs(dailySongs);
            store.commit('recommendSongs/change', dailySongs);
            rSong.value = dailySongs;
        }
    }
    loading.value = false;
});
</script>

<template>
    <Loading :loading="loading" top="200px">
        <div>
            <Banner :imgList="bannerData"></Banner>
            <Title title="推荐歌单" path="/discoveMusic/songSheet"></Title>
            <div class="song-sheet-list">
                <div class="song-sheet">
                    <router-link :to="`/songSheet/${-11}`" :key="-11">
                        <div class="song-sheet-bg base-pointer">
                            <div class="song-sheet-copywriter base-absolute">
                                <span>根据您的音乐口味生成每日更新</span>
                            </div>
                            <div class="calendar base-absolute">
                                <span class="calendar base-absolute calendar-day"> {{ nowDay }} </span>
                                <calendar-outlined class="calendar base-absolute" />
                            </div>
                            <div class="play-song-but base-absolute showLatelyList" @click="playSong(+rSong[0].id, 'song')">
                                <caret-right-outlined class="base-size22px" />
                            </div>
                        </div>
                    </router-link>
                    <div class="copywriter-details base-pointer ellipsis-multiline">
                        <span>每日歌曲推荐</span>
                    </div>
                </div>
                <router-link 
                    v-for="item in songSheet" 
                    :to="`/songSheet/${item.id}`" 
                    :key="item.id"
                    class="song-sheet" 
                >
                    <div class="song-sheet-bg base-pointer">
                        <div class="play-count base-absolute">
                            <play-circle-outlined />
                            <span style="margin-left: 2px"> {{ parsePlayCount(String(item.playcount)) }} </span>
                        </div>
                        <img :src="item.picUrl+'?param=200y200'">
                        <div class="play-song-but base-absolute showLatelyList" @click="querySong(item.id, 'sheet', $event)">
                            <caret-right-outlined class="base-size22px" />
                        </div>
                    </div>
                    <div class="copywriter-details base-pointer ellipsis-multiline">
                        {{ item.name }}
                    </div>
                </router-link>
            </div>
            <Title title="独家放送" path="/"></Title>
            <PrivateContentCard :entry="true" :list="privateContent"></PrivateContentCard>
            <Title title="最新音乐" path="/"></Title>
            <div class="new-song-main">
                <div v-for="item in newSong" class="new-song base-pointer" :key="item.id">
                    <div class="new-song-ico">
                        <div class="play-song-but  base-absolute">
                            <caret-right-outlined class="base-size18px" />
                        </div>
                        <img :src="item.picUrl + '?param=50y50'">
                    </div>
                    <div class="new-song-info">
                        <div class="new-song-name">
                            {{ item.name }}
                        </div>
                        <div class="new-song-artists">
                            {{ parseArtists(item.song.artists) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Loading>
</template>

<style lang='less'>
.song-sheet-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
}

.song-sheet {
    flex: 18.54% 0;
    color: #333333;

    &:hover {
        color: #333333;
    }
}

.song-sheet-bg {
    position: relative;
    height: 80%;
    border-radius: 8px;
    overflow: hidden;
    user-select: none;

    img {
        width: 100%;
        height: 100%;
    }

    &:hover .play-song-but {
        opacity: 1;
    }
}

.song-sheet:first-child .song-sheet-bg {
    background: linear-gradient(160deg,#174a5c 0%,#1f609c 51%,#24718d 75%, #3289a8);
    &:hover .song-sheet-copywriter {
        transform: translateY(0);
    }
}

.song-sheet-copywriter {
    width: 100%;
    top: 0px;
    padding: 4px 0;
    text-align: center;
    font-size: 12px;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.2);
    transform: translateY(-100%);
    transition: transform 0.2s 500ms;
}

.calendar {
    top: 50%;
    left: 50%;
    color: #ffffff;
    font-size: 80px;
    transform: translate(-50%, -50%);
}

.calendar-day {
    font-size: 24px;
    font-weight: 700;
    transform: translate(-50%, -10%);
} 

.play-count {
    top: 5px;
    right: 10px;
    color: #ffffff;
}

.play-song-but {
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 10px;
    bottom: 10px;
    width: 30px;
    height: 30px;
    background-color: #ffffff;
    color: red;
    border-radius: 50%;
    transition: opacity 0.5s;
}

.copywriter-details {
    margin-top: 5px;
    -webkit-line-clamp: 2;
    transition: color 0.5s;

    &:hover {
        color: #000000;
    }
}

.new-song-main {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    height: 260px;
    gap: 20px
}

.new-song {
    display: flex;
    gap: 5px;
    width: 350px;
    border-radius: 8px;
    overflow: hidden;
    transition: background-color 0.2s;

    &:hover {
        background-color: #cccccc;
    }
}

.new-song-ico {
    position: relative;
    border-radius: 8px;
    overflow: hidden;

    .play-song-but {
        opacity: 1;
        left: 50%;
        top: 50%;
        width: 25px;
        height: 25px;
        transform: translate(-50%, -50%);
    }
}

.new-song-artists {
    padding-top: 5px;
}
</style>
