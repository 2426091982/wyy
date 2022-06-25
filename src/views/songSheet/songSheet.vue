<script lang='ts' setup>
import { 
    useRoute
} from "vue-router";
import { 
    day, 
    getItem, 
    notOpened, 
    now, 
    parsePlayCount 
} from "@/utils";
import { 
    CalendarOutlined,
    CaretRightOutlined, 
    FolderAddOutlined, 
    UserOutlined 
} from "@ant-design/icons-vue";
import { 
    changePlayList, 
    playListSong, 
    toPlayList 
} from "@/utils/song";
import { getPlayListDetail } from "@/api/songSheet";
import { useStore } from "@/store";
import { SongSheetData } from "@/store/types/songSheet";
import { Response } from "@/types/base";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { parseSongSheetInfo } from "@/utils/parseData";
import { PlayListInfo } from "@/store/types/playList";
import NavBar from '@/components/navBar/index.vue';
import Loading from "@/components/loading.vue";
import { RecommendSongsStatic } from "@/types/song";
import { getUserDetail } from "@/api";

const route = useRoute();
const store = useStore();
const ellipsis = ref(true);
const loading = ref(true);
const id = ref(+route.params.id);
const tracks = ref<PlayListInfo[]>([]);
const songSheetInfo = ref<SongSheetData>();
const nowDay = day();
const list = [
    {
        name: '歌曲列表',
        path: `/songSheet/${id.value}`,
    }
];
/**
 * 点击开始播放，播放当前列表的音乐
 */
const playCurrentList = () => {
    const currentMusic = store.state.currentMusic;
    if (currentMusic.id === tracks.value[0].id) {
        store.commit('currentMusic/playSong', !currentMusic.play);
        return;
    }
    playListSong(tracks.value[0], 0, tracks.value, id.value);
    changePlayList(tracks.value, songSheetInfo.value!.trackCount, id.value);
};

/* 创建歌单时间 */
const createTime = (time: number) => {
    let date = new Date(time);
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}创建`;
};

const changeTracks = (songs: PlayListInfo[]) => {
    tracks.value.push(...songs);
};

const init = async () => {
    if (id.value !== -11) {
        const {
            code,
            playlist,
        } = await getPlayListDetail(id.value) as Response & { playlist: SongSheetData };
        if (code === 200 && playlist) {
            songSheetInfo.value = parseSongSheetInfo(playlist);
        }
    } else {
        const { identify, } = await getUserDetail(1) as { identify: { imageDesc: string, imageUrl: string }} ;
        const songsData = getItem('recommend-songs') as RecommendSongsStatic;
        songSheetInfo.value = {
            copywriter: '',
            coverImgUrl: '',
            createTime: now(),
            description: '根据你的口味每日推荐的歌单',
            id: -11,
            creator: {
                avatarImgId: 1,
                avatarUrl: identify.imageUrl,
                backgroundUrl: identify.imageUrl,
                description: '网易云官方账号',
                nickname: identify.imageDesc,
            },
            name: '每日推荐',
            picUrl: '',
            playCount: 0,
            shareCount: 0,
            subscribed: false,
            tags: ['每日推荐'],
            trackCount: songsData.songs.length,
            tracks: songsData.songs,
        } as SongSheetData;
    }
    
    const currentList = store.state.playList.currentList;
    // 匹配长度最多的列表
    if(currentList.id === id.value && currentList.songs.length > 20) {
        tracks.value = currentList.songs;
    } else {
        tracks.value = toPlayList(songSheetInfo.value!.tracks);
    }
    loading.value = false;
};

onMounted(init);
</script>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
export default defineComponent({
    name: 'songSheet',
});
</script>

<template>
    <div>
        <Loading :loading="loading" :top="'200px'">
            <div v-if="songSheetInfo">
                <div class="song-sheet-info">
                    <img loading="lazy" 
                        v-if="id !== -11"
                        :src="songSheetInfo.coverImgUrl + '?param=184y184'" 
                        width="184" 
                        height="184" 
                        alt="图片背景"
                    />
                    <div class="calendar-container" v-else>
                        <div class="calendar base-absolute">
                            <span class="calendar base-absolute calendar-day"> {{ nowDay }} </span>
                            <calendar-outlined class="calendar base-absolute" />
                        </div>
                    </div>
                    <div>
                        <div class="song-sheet-info-title">
                            <a-tag color="blue">歌单</a-tag>
                            <h2>{{ songSheetInfo.name }}</h2>
                        </div>
                        <div class="song-sheet-info-author">
                            <a-avatar v-if="songSheetInfo?.creator" size="small">
                                <template #icon>
                                    <img loading="lazy" :src="songSheetInfo.creator.avatarUrl" alt="">
                                </template>
                            </a-avatar>
                            <a-avatar v-else size="small">
                                <template #icon><UserOutlined /></template>
                            </a-avatar>
                            <router-link to="/" class="nickname">{{ songSheetInfo?.creator.nickname }}</router-link>
                            <span class="create-time"> {{ createTime(songSheetInfo.createTime) }} </span>
                        </div>
                        <div class="song-sheet-info-buts">
                            <a-button type="primary" shape="round" @click="playCurrentList">
                                <template #icon>
                                    <caret-right-outlined class="base-size18px" />
                                </template>
                                开始播放
                            </a-button>
                            <a-button shape="round" @click="notOpened">
                                <template #icon>
                                    <folder-add-outlined class="base-size18px" />
                                </template>
                                收藏 {{ parsePlayCount(String(songSheetInfo.subscribedCount)) }}
                            </a-button>
                        </div>
                        <div class="song-sheet-info-tags">
                            标签：<span>{{ songSheetInfo['tags'].join('/') }}</span>
                        </div>
                        <div class="song-sheet-info-playCount">
                            歌曲：<span> {{ songSheetInfo.trackCount }} </span>
                            &nbsp;
                            播放：<span> {{ parsePlayCount(String(songSheetInfo.playCount)) }} </span>
                        </div>
                        <a-tooltip>
                            <template #title>点击显示(隐藏)文字</template>
                            <p 
                                :class="`song-sheet-info-detail base-pointer ${ ellipsis ? 'ellipsis' : '' }`"
                                @click="ellipsis = !ellipsis"
                            > 简介：{{ songSheetInfo.description }} </p>
                        </a-tooltip>
                    </div>
                </div>
                <NavBar :list="list"></NavBar>
            </div>
        </Loading>
        <router-view v-if="songSheetInfo && !loading" v-slot="{ Component }">
            <component
                :is="Component"
                :bigList="true"
                :id="id"
                :tracks="tracks"
                :trackCount="songSheetInfo.trackCount"
                @changeTracks="changeTracks"
            />
        </router-view>
    </div>
</template>

<style lang='less'>
.calendar-container {
    position: relative;
    width: 184px;
    height: 184px;
    
    .calendar {
        color: #1890ff;
    }
}

.song-sheet-info {
    display: flex;
    margin: 20px 0;
    gap: 20px;

    img {
        border-radius: 8px;
    }
}

.song-sheet-info-title {
    display: flex;
    align-items: center;

    h2 {
        margin: 0;
    }
}

.song-sheet-info-author {
    margin: 10px 0;

    .nickname {
        margin-left: 5px;
        margin-right: 5px;
    }
}

.song-sheet-info-buts {
    margin-bottom: 10px;

    .ant-btn:nth-child(2) {
        margin-left: 10px;
        margin-right: 10px;
    }
}

.song-sheet-info-playCount {
    line-height: 30px;
}

.song-sheet-info-detail {
    -webkit-line-clamp: 1;
    min-width: 50%;
}
</style>
