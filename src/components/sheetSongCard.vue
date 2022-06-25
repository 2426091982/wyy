<script lang='ts' setup>
import {
    UserOutlined,
    CalendarOutlined,
    CaretRightOutlined,
    PlayCircleOutlined
} from '@ant-design/icons-vue';
import { 
    getItem,  
    parsePlayCount, 
    day
} from '@/utils';
import { 
    playListDetail,
} from '@/utils/sheetSong';
import { useStore } from '@/store';
import { RecommendSongsData } from '@/store/types/recommendSongs';
import { listType, SongSheetData } from '@/store/types/songSheet';
import { RecommendSongsStatic } from '@/types/song';
import { onMounted, PropType } from '@vue/runtime-core';
import { ref } from '@vue/runtime-dom';
import { getPlayListDetail, getRecommendSongs } from '@/api';
import { parseRecommendSongs } from '@/utils/parseData';
import { Response } from '@/types/base';
import { playListSong, toPlayList } from '@/utils/song';

const { dayRecommend, songSheet } = defineProps({
    dayRecommend: {
        type: Boolean,
        default: false,
    },
    list: Boolean,
    songSheet: { // 歌单数据
        type: Array as PropType<SongSheetData[]>,
    },
});

let index = 0; // 推荐歌单当前播放的index
const nowDay = day();
const store = useStore();
const list = store.state.songSheet.list;
const recommendSongs = getItem('recommend-songs') as RecommendSongsStatic;
const rId = -11;
const rSong = ref<RecommendSongsData[]>((recommendSongs?.songs) || []);
const errorFn = () => {
    playListSong(toPlayList(rSong.value)[++index], index, rSong, rId, errorFn);
};

type ToPlayListDetail = (sid: number, needFind?: boolean) => Promise<{id: number, list: SongSheetData } | undefined>
const toPlayListDetail: ToPlayListDetail = async (sid, needFind = false) => {
    playListDetail(sid);
    const { 
        code, 
        playlist, 
    } = await getPlayListDetail(sid) as Response & { playlist: SongSheetData };
    if (code === 200) {
        if (!needFind) {
            let hasList = list.find((item) => item.id === sid);
            if (hasList) return hasList; // 列表已经存在不需要重新加进去
        }
        let listVal: listType = {
            id: sid,
            list: playlist,
        };
        store.commit('songSheet/add', listVal);
        return listVal;
    }
};

const playSong = async (id: number) => {
    let hasList = list.find((item) => item.id === id);
    if (!hasList) {
        hasList = await toPlayListDetail(id, true) as listType ;
    }
    let index = 0;
    let songs = toPlayList(hasList.list.tracks);
    let callBack = () => {
        playListSong(songs[index], index, songs, id, callBack);
        ++index;
    }
    callBack();
};

if (dayRecommend && store.state.isLogin) {
    onMounted(async () => {
        // 获取每日推荐歌曲
        if (!recommendSongs || recommendSongs.day != nowDay) {
            let { 
                
                dailySongs,
            } = await getRecommendSongs() as{ dailySongs: RecommendSongsData[] };
            dailySongs = parseRecommendSongs(dailySongs);
            store.commit('recommendSongs/change', dailySongs);
            rSong.value = dailySongs;
        }
    });
}
</script>

<template>
    <div class="song-sheet" v-if="dayRecommend">
        <router-link :to="`/songSheet/${rId}`" :key="rId">
            <div class="song-sheet-bg base-pointer">
                <div class="song-sheet-copywriter base-absolute">
                    <span>根据您的音乐口味生成每日更新</span>
                </div>
                <div class="calendar base-absolute">
                    <span class="calendar base-absolute calendar-day"> {{ nowDay }} </span>
                    <calendar-outlined class="calendar base-absolute" />
                </div>
                <div 
                    class="play-song-but base-absolute showLatelyList" 
                    @click.prevent="playListSong(toPlayList(rSong)[index], index, rSong, rId, errorFn)"
                >
                    <caret-right-outlined class="base-size22px" />
                </div>
            </div>
        </router-link>
        <div class="copywriter-details base-pointer ellipsis-multiline">
            <span>每日歌曲推荐</span>
        </div>
    </div>
    <router-link 
        v-else
        v-for="item in songSheet" 
        :to="`/songSheet/${item.id}`" 
        :key="item.id"
        @click="toPlayListDetail(item.id)"
        class="song-sheet" 
    >
        <div class="song-sheet-bg base-pointer">
            <div class="play-count base-absolute">
                <play-circle-outlined />
                <span style="margin-left: 2px"> 
                    {{ parsePlayCount(String(item.playcount || item.playCount)) }} 
                </span>
            </div>
            <div class="song-sheet-nickname base-absolute">
                <user-outlined />
                <span>{{ item.name || item.creator.nickname }}</span>
            </div>
            <img :src="item.picUrl || item.coverImgUrl +'?param=200y200'" width="200" height="200">
            <div 
                class="play-song-but base-absolute showLatelyList" 
                @click.stop.prevent="playSong(item.id)">
                <caret-right-outlined class="base-size22px" />
            </div>
        </div>
        <div class="copywriter-details base-pointer ellipsis-multiline">
            {{ item.name }}
        </div>
    </router-link>
</template>

<style lang='less'>
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
}

.song-sheet-bg:hover .play-song-but,
.highquality-img:hover .play-song-but {
    opacity: 1;
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

.song-sheet-nickname {
    left: 5px;
    bottom: 10px;
    color: #ffffff;
    font-size: 12px;

    span {
        margin-left: 4px;
    }
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
</style>
