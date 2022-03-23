<script lang='ts' setup>
import { 
    onBeforeUnmount, 
    onMounted, 
    PropType
} from '@vue/runtime-core';
import { 
    getSongSheetSongsData, 
    playListSong, 
    toPlayList 
} from '@/utils/song';
import { useStore } from '@/store';
import { ref } from '@vue/reactivity';
import { Empty } from 'ant-design-vue';
import { PlayListInfo } from '@/store/types/playList';
import Icon from '@/components/icon.vue';

const props = defineProps({
    bigList: {
        type: Boolean,
        default: false,
    },
    id: {
        type: Number,
    },
    tracks: {
        type: Array as PropType<PlayListInfo[]>,
        default: [],
    },
    trackCount: {
        type: Number,
        default: 0,
    },
});
const emit = defineEmits(['changeTracks']);

let observer: IntersectionObserver;
let root: HTMLDivElement;
let wait = false;
const store = useStore();
const observerEl = ref<HTMLDivElement>();
const currentMusic = store.state.currentMusic;
const playList = store.state.playList;
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

// 获取列表
const list = (() => {
    const currentList = playList.currentList;
    if (props.bigList && props.id === currentList.id) { // 当前播放列表ID和现在列表一样
        if (props.tracks.length > currentList.songs.length) {
            return props.tracks;
        } else {
            return currentList.songs;
        }
    } else if (props.bigList) { // 进入其他歌单列表
        const songSheets = playList.cacheSongSheets;
        for(let i = 0; i < songSheets.length; i++){
            const songSheet = songSheets[i];
            if (songSheet.id === props.id) {
                return toPlayList(songSheet.info.tracks);
            }
        }
        return props.tracks;
    } else { // 侧边列表
        return playList.playList;
    }
})();

/* 加载歌曲数据 */
const loadSongsData = () => {
    if (wait) return;
    wait = true;
    let bigList = props.bigList;
    let id = playList.playListId;
    let total = playList.total;
    let length = playList.playList.length;
    let end = false;

    if (bigList) {
        id = +props.id!;
        total = +props.trackCount!;
        length = props.tracks!.length;
    }

    if (total <= length) return;

    let limit = 20;
    let offset = length / limit;

    if ((length + limit) > total) {
        limit = total - length + 1; 
        offset = total - limit;
        end = true;
    }

    getSongSheetSongsData(id, limit,  offset)
        .then((songs) => {
            end ? songs.shift() : null;
            let songsData = toPlayList(songs);
            if (bigList) {
                emit('changeTracks', songsData);
                list.push(...songsData);
                store.commit('playList/updateCacheSongSheets', { id, songs, });
            } else if (!bigList && id === playList.currentList.id) {
                // 如果侧边列表中加载的数据大列表中也用到，那么将同步到大列表中
                store.commit('playList/updateCurrentList', songsData);
            }
            
            if (bigList && playList.playListId !== playList.currentList.id) {
                return wait = false;
            }

            store.commit('playList/addPlayList', songsData);
            wait = false;
        });
};

/* 观察者触发加歌曲载数据 */
const observerFn: IntersectionObserverCallback = async(entry) => {
    let flag = playList.playListId === -1;
    let ratio = entry[0].intersectionRatio;
    if (ratio <= 0 || flag && !props.bigList) return;
    loadSongsData();
};

// 设置观察者
const loadMore = () => {
    if (!observerEl.value) return;
    root = observerEl.value.parentElement!.parentElement as HTMLDivElement;
    let options: IntersectionObserverInit  = {
        root: root,
        rootMargin: '0px',
        threshold: [0],
    };
    observer = new IntersectionObserver(observerFn, options);
    observer.observe(observerEl.value);
};

// 定位到播放的歌曲
const location = () => {
    const el = document.querySelector('.play-item') as HTMLDivElement;
    if (!el) {
        root.scrollTop = 0;
        return;
    }
    const {
        offsetTop: elT,
        scrollHeight: elH,
    } = el;
    const {
        scrollTop: rootT,
        clientHeight: rootH,
    } = root;
    const actualH = elT + elH;
    const direction = rootT / actualH > 1 ? 't' : 'b';
    const clearAnimt = () => cancelAnimationFrame(id);
    const animationFn = () => {
        let rootT = root.scrollTop;
        if (rootT < elT && direction === 'b') {
            let moveH = Math.max(actualH / rootT, 20) * 10;
            !isFinite(moveH) || Math.floor(moveH) === 0 ? moveH = 5 : null;
            if (rootT >= elT || rootT + rootH >= root.scrollHeight) {
                root.scrollTop = elT; // 将最后一次移动，对齐目标位置防止出现偏差
                return clearAnimt();
            }
            root.scrollTop += moveH;
        } else if (rootT >= elT && direction === 't') {
            let moveH = Math.max(rootT / actualH, 20) * 10;
            !isFinite(moveH) || Math.floor(moveH) === 0 ? moveH = 5 : null;
            if (rootT === 0) {
                root.scrollTop = elT;
                return clearAnimt();
            }
            root.scrollTop -= moveH;
        } else {
            root.scrollTop = elT;
            return clearAnimt();
        }
        requestAnimationFrame(animationFn);
    };
    const id = requestAnimationFrame(animationFn);
};

const playSong = (item: PlayListInfo, key: number) => {
    if (props.bigList) {
        const { 
            id, 
            tracks, 
            trackCount, 
        } = props;
        store.commit('playList/changePlayList', {
            id,
            songs: tracks, 
            size: trackCount, 
        });
    }
    playListSong(item, key);
};

onMounted(loadMore);
onBeforeUnmount(() => {
    observer && observer.unobserve(root);
});
</script>

<template>
    <div>
        <div :class="`current-location base-pointer  ${ bigList ? 'big-list' : '' }`" @click="location">
            <Icon type="icon-dingwei" size="24"></Icon>
        </div>
        <a-empty 
            v-if="!playList.playList.length && !bigList" 
            :image="simpleImage"
            class="empty-list"
        >
            <template #description>
                <p style="margin-bottom: 0;">你还没有添加任何音乐</p>
                <span style="margin-right: 5px;">去首页</span>
                <router-link to="/">发现音乐</router-link>
            </template>
        </a-empty>
        <div v-else :class="`current-play-list ${ bigList ? 'big-list' : '' }`">
            <div class="current-play-item">
                <span class="number">序号</span>
                <span class="flex-2 song-name">歌名</span>
                <span class="flex-2 song-composer">歌手</span>
                <span class="flex-2 size-time" style="color: #333333">时长</span>
            </div>
            <div 
                v-for="(item, key) in list"
                :key="key"
                :class="`current-play-item ${currentMusic.id === item.id ? 'play-item' : ''}`"
                @dblclick="playSong(item, key)"
            >
                <span class="number">{{ key + 1 }}</span>
                <div class="song-name flex-2 ellipsis">
                    {{ item.name }}
                </div>
                <div class="song-composer flex-2 ellipsis">
                    {{ item.artists }}
                </div>
                <div class="size-time flex-2 ellipsis">
                    {{ item.totalTime }}
                </div>
            </div>
        </div>
        <div ref="observerEl" class="observer">
            {{  
                bigList 
                    ? tracks.length >= trackCount 
                        ? '已经到底了' 
                        : '加载中...'
                    : playList.playList.length >= playList.total 
                        ? '已经到底了' 
                        : '加载中...' 
            }}
        </div>
    </div>
</template>

<style lang='less'>
.current-location {
    position: absolute;
    bottom: 50px;
    right: 15px;
    transition: color 0.2s;
    z-index: 10;

    &:hover {
         color: #1890ff;
    }
}

.empty-list {
    padding-top: 40px;
}

.observer {
    padding: 10px;
    text-align: center;
    color: #999999;
}

.current-play-list {
    position: relative;
    user-select: none;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s;
}

.list-title {
    display: flex;
    margin: 10px;
    justify-content: space-evenly;
    align-items: center;
    gap: 10px;
}

.current-play-item {
    display: flex;
    padding: 5px;
    justify-content: space-evenly;
    align-items: center;
    transition: background-color 0.2s;

    &:nth-child(even) {
        background-color: rgba(200, 200, 200, 0.2);
    }

    &:hover {
        background-color: rgba(200, 200, 200, 0.4);
    }
}

.play-item {
    .song-name {
        color: #1890ff;
    }

    .song-composer {
        color: #1890ff;
    }
}

.song-name {
    width: 110px;
}

.song-composer {
    flex-basis: 90px;
}

.size-time {
    width: 50px;
    color: #999999;
}

.load-more {
    margin: 20px auto;
    text-align: center;
}

.big-list {
    .song-name {
        width: 250px;
    } 

    .song-composer {
        flex-basis: 250px;
    }

    .size-time {
        width: 200px;
    }

    &.current-location {
        bottom: 16%;
        right: 10%;
    }

    .play-item {

        .number {
            color: #1890ff;
        }

        .size-time {
            color: #1890ff;
        }
    }

    .number {
        flex: 1 0;
        text-align: center;
    }

    .flex-2 {
        flex: 3 0;
    }
}
</style>
