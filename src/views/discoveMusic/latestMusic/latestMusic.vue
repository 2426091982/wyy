<script lang='ts' setup>
import { ref } from "@vue/reactivity";
import {
    CaretRightOutlined
} from '@ant-design/icons-vue';
import { getSongUrl, getTopSong } from "@/api";
import { LatesMusic } from "@/types/song";
import { getItem, handlePlayTime, parseArtists } from "@/utils";
import { onBeforeUnmount } from "vue";
import LazyLoading from "@/components/lazyLoading.vue";
import Loading from "@/components/loading.vue";
import { playListSong } from "@/utils/song";
import { PlayListInfo } from "@/store/types/playList";

const loading = ref(true);
const noodLoading = ref(true);
const type = ref(Number(sessionStorage.getItem('late-musice-cat')) || 0);
const list = ref<LatesMusic[]>([]);
const cats = [
    {
        type: 0,
        name: '全部',
    },
    {
        type: 7,
        name: '华语',
    },
    {
        type: 96,
        name: '欧美',
    },
    {
        type: 8,
        name: '日本',
    },
    {
        type: 16,
        name: '韩国',
    }
];

const latestList = getItem<PlayListInfo[]>('play-list');

let totalSong: LatesMusic[] = [];
let lastIndex = 20;

const playSong = async (song: LatesMusic, key: number) => {
    const { 
        album,
        artists,
        duration,
        name,
        id: sid,
    } = song;
    const [{ url, }] = await getSongUrl(sid) as [{ url: string }];
    let songInfo = {
        br: 1200,
        artists: parseArtists(artists),
        id: album.id,
        likes: false,
        name: name,
        pic: album.blurPicUrl || album.picUrl,
        play: true,
        totalTime: handlePlayTime(duration / 1000),
        url,
    };
    playListSong(songInfo as PlayListInfo, key, latestList, -1, () => {
        playSong(song[++key], key);
    });
};

/**
 * 改变新歌列表的类型
 */
const changeType = async (t: number) => {
    loading.value = true;
    type.value = t;
    lastIndex = 20;
    sessionStorage.setItem('late-musice-cat', `${t}`);
    await requestList(true);
    loading.value = false;
};

const requestList = async (changeType = false) => { 
    const topSongs = await getTopSong(type.value) as LatesMusic[];
    const chunk = topSongs.slice(0, lastIndex);
    changeType ? list.value = chunk : list.value.push(...chunk);
    totalSong = topSongs;
};

const observer = (el: HTMLDivElement) => {
    const ob = new IntersectionObserver((enters) => {
        if (enters[0].intersectionRatio === 0 || loading.value) return;
        list.value.push(...totalSong.slice(lastIndex, lastIndex += 20));
    });
    ob.observe(el);
    onBeforeUnmount(() => ob.unobserve(el));
};

requestList().finally(() => loading.value = false);
</script>

<template>
    <div>
        <h2 class="late-musice-title">新歌速递</h2>
        <div class="late-musice-btns">
            <div v-for="cat in cats" :key="cat.type">
                <span 
                    :class="`base-pointer ${type === cat.type ? 'btn-active' : ''}`"
                    @click="changeType(cat.type)"
                > 
                    {{ cat.name }} 
                </span>
            </div>
        </div>
        <Loading :loading="loading" height="200px">
            <div class="late-musice-list">
                <div 
                    v-for="(item, key) in list" 
                    class="late-musice-item"
                    :key="item.id"
                >
                    <div class="late-musice-item-bg">
                        <span>{{ key + 1 >= 10 ? key + 1 : '0' + (key + 1) }}</span>
                        <div>
                            <img 
                                loading="lazy" 
                                :src="`${item.album.picUrl || item.album.blurPicUrl}?param=60y60`"
                                alt="歌曲图片"
                            />
                            <div class="play-song-but  base-absolute">
                                <caret-right-outlined class="base-size18px" @click="playSong(item, key)" />
                            </div>
                        </div>
                        <span>{{ item.name }}</span>
                    </div>
                    <div class="late-musice-item-detail">
                        <span class="ellipsis">{{item.artists.length < 4 ? parseArtists(item.artists) : '群星' }}</span>
                        <span class="ellipsis">{{ item.name }}</span>
                    </div>
                    <span class="late-musice-item-time">{{ handlePlayTime(item.duration / 1000) }}</span>
                </div>
                <LazyLoading @observer="observer"></LazyLoading>
            </div>
        </Loading>
    </div>
</template>

<style lang='less'>
.late-musice-title {
    margin: 20px 0;
    text-align: center;
}

.late-musice-btns {
    padding-left: 30px;
    display: flex;
    gap: 20px;
}

.btn-active {
    font-weight: 700;
}

.late-musice-list {
    margin-top: 20px;
    width: 1160px;
}

.late-musice-item {
    display: flex;
    padding: 5px 40px;
    width: 100%;
    height: 80px;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s;

    &:nth-child(odd) {
        background-color: #fafafa;
    }
    
    &:nth-child(even) {
        background-color: #ffffff;
    }

    &:hover {
        background-color: #f0f0f0;
    }
}

.late-musice-item-bg {
    position: relative;
    flex: 2;
    display: flex;
    align-items: center;
    width: 60px;
    height: 60px;
    gap: 20px;

    img {
        width: 60px;
        height: 60px;
        border-radius: 8px;
    }

    > div {
        position: relative; 
        background-color: #cccccc;
        border-radius: 8px;
    }

    .play-song-but {
        opacity: 1;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.late-musice-item-detail {
    flex: 1.8;

    span:first-child {
        margin-right: 20px;
    }

    span {
        display: inline-block;
        width: 200px;
    }
}

.late-musice-item-time {
    color: 999999;
}
</style>
