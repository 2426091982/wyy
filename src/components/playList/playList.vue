<script lang='ts' setup>
import { 
    onBeforeUnmount, 
    PropType,
    ref,
    watch,
    watchEffect
} from '@vue/runtime-core';
import { 
changePlayList,
    getSongSheetSongsData, 
    playListSong, 
    toPlayList 
} from '@/utils/song';
import { useStore } from '@/store';
import { Empty } from 'ant-design-vue';
import { PlayListInfo } from '@/store/types/playList';
import Icon from '@/components/icon.vue';
import lazyLoading from '../lazyLoading.vue';

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
let root: Element;
const store = useStore();
const currentMusic = store.state.currentMusic;
const playList = store.state.playList;
const total = ref(props.bigList ? props.trackCount : playList.total);
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const location = ref(false);

const getList = () => {
    if (props.bigList) { // 进入其他歌单列表
        return props.tracks;
    } else { // 侧边列表
        return playList.playList;
    }
};

const list = ref(getList());

let wait = false;
/* 加载歌曲数据 */
const loadSongsData = () => {
    wait = true;
    let bigList = props.bigList;
    let id = playList.playListId;
    let start = playList.playList.length;
    let end = false;

    if (bigList) {
        id = Number(props.id);
        start = list.value.length;
    }
    
    if (total.value <= start) return;

    let limit = 20;
    let offset = start / limit;

    if ((start + limit) > total.value) {
        limit = total.value - start + 1; 
        offset = total.value - limit;
        end = true;
    }
    
    getSongSheetSongsData(id, limit,  offset)
        .then((songs) => {
            end ? songs.shift() : null;
            let songsData = toPlayList(songs);
            let len = list.value.length;
            if (list.value[len - 1].id === songs[songs.length -1].id) return; // 防止多次发送同样请求
            if (offset.toString().includes('.')) { // 针对出现小数点的情况
                songsData.splice(0, 10);
            }
            if (bigList) {
                return emit('changeTracks', songsData);
            } else if (!bigList && id === playList.currentList.id) {
                // 如果侧边列表中加载的数据大列表中也用到，那么将同步到大列表中
                return store.commit('playList/updateCurrentList', songsData);
            }
            if (bigList && playList.playListId !== playList.currentList.id) return;    
            store.commit('playList/addPlayList', songsData);
        })
        .finally(() => wait = false);
};

/* 观察者触发加歌曲载数据 */
const observerFn: IntersectionObserverCallback = async(entrys) => {
    if (props.id === -11) return; // 如果是每日推荐那么不需要加载
    const entry = entrys[0];
    const ratio = entry.intersectionRatio > 0;
    if (ratio && !wait) {
        // 如果总长度已经够了那么就清除观察者,只限大列表
        list.value.length !== total.value
            ? loadSongsData() 
            : props.bigList 
                ? observer.unobserve(entry.target)
                : null;
    }
};

// 设置观察者
const loadMore = (el: HTMLDivElement) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    root = el.parentElement!.parentElement!;
    if (props.bigList) {
        root = document.documentElement;
    }
    let options: IntersectionObserverInit  = {
        root: root,
        rootMargin: '0px',
        threshold: [0],
    };
    observer = new IntersectionObserver(observerFn, options);
    observer.observe(el);
};

const playSong = (item: PlayListInfo, key: number) => {
    const { 
        id, 
        tracks, 
        trackCount,
        bigList,
    } = props;
    if (bigList && playList.playListId !== id) {
        changePlayList(tracks, trackCount, id);
    }
    playListSong(item, key, list.value, playList.playListId, () => {
        playSong(list.value[++key], key);    
    });
};

watch(
    () => playList.currentList,
    (newData) => {
        if (newData == null) return;
        list.value = newData.songs;
    }
);

watchEffect(() => {
    list.value.find((item) => { // 如果当前歌曲在列表中，才显示定位按钮
        return (item.id === currentMusic.id 
        ? location.value = true
        : false);
    });
});

onBeforeUnmount(() => {
    observer && observer.unobserve(root);
});
</script>

<template>
    <div>
        <a
            v-if="location"
            href="#scroll-smooth"
            :class="`current-location base-pointer  ${ bigList ? 'big-list' : '' }`"
        >
            <Icon type="icon-dingwei" size="24"></Icon>
        </a>
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
                :key="item.id" 
                :id="currentMusic.id === item.id ? `scroll-smooth` : ''"
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
        <lazyLoading @observer="loadMore">
            {{  
                bigList 
                    ? list.length >= trackCount 
                        ? '已经到底了' 
                        : '加载中...'
                    : list.length >= playList.total 
                        ? '已经到底了' 
                        : '加载中...' 
            }}
        </lazyLoading>
    </div>
</template>

<style lang='less'>
.current-location {
    position: absolute;
    bottom: 50px;
    right: 15px;
    color: #999999;
    transition: color 0.2s;
    z-index: 10;

    &:hover {
         color: #1890ff;
    }
}

.empty-list {
    padding-top: 40px;
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
