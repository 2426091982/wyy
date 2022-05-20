<script lang='ts' setup>
import { 
    handlePlayTime, 
    parseArtists 
} from "@/utils";
import { RecommendSongsData } from "@/store/types/recommendSongs";
import { markStr } from "@/utils/search";
import { PropType } from "@vue/runtime-core";
import { useStore } from "@/store";
import { playListSong, toPlayList } from "@/utils/song";

defineProps({
    songList: {
        type: Array as PropType<RecommendSongsData[]>,
        requierd: true,
    },
    keyword: {
        type: String,
        required: true,
    },
});

const store = useStore();
const list = store.state.playList.playList;
let song = store.state.currentMusic;
const handlePlay = (data: RecommendSongsData) => {
    let songInfo = toPlayList(data);
    let index = 0;
    let callBack = () => {
        playListSong(songInfo[index] || list[index], index, list, -1, callBack);
        index++;
    };
    callBack();
};
</script>

<template>
    <div class="search-list-title-format search-list-title">
        <span class="search-list-flex3">音乐标题</span>
        <span class="search-list-flex2">歌手</span>
        <span class="search-list-flex2">专辑</span>
        <span class="search-list-flex1">时长</span>
        <span class="search-list-flex1">热度</span>
    </div>
    <div 
        v-for="(item, key) in songList"
        :key="key"
        :class="`search-list-content-format ${song.id === item.id ? 'search-play-item' : ''}`"
        @dblclick="handlePlay(item)"
    >
        <span class="order base-absolute ccc">
            {{ key + 1 > 9 ? key + 1 : `0${key+1}` }}
        </span>
        <span 
            v-html="`
                ${markStr(item.name, keyword)} 
                ${ item.alia.length ? `（${markStr(item.alia.join(' '), keyword)}）` : ''}`"
            class="search-list-flex3 ellipsis"
        >
        </span>
        <span 
            v-html="markStr(parseArtists(item.ar), keyword)"
            class="search-list-flex2 ellipsis"
        ></span>
        <span 
            v-html="markStr(item.al.name, keyword) || '未知专辑'"
            class="search-list-flex2 ellipsis"
        ></span>
        <span class="search-list-flex1 ccc">
            {{ handlePlayTime(item.dt / 1000) }}
        </span>
        <div class="search-list-flex1 hot-line">
            <div class="base-absolute ellipsis"></div>
            <div 
                class="base-absolute ellipsis"
                :style="{
                    backgroundColor: '#cccccc',
                    width: `${item.pop}%`,
                }"
            ></div>
        </div>
    </div>
</template>

<style lang='less'>
.ccc {
    color: #cccccc;
}

.search-list-title-format,
.search-list-content-format {
    display: flex;
    padding: 0 100px;
    justify-content: space-between;
    gap: 20px;
}

.search-list-title-format {
    margin-top: 20px;
    margin-bottom: 10px;
}

.search-list-content-format {
    position: relative;
    height: 35px;
    align-items: center;
    user-select: none;

    &:nth-child(even) {
        background-color: #f5f5f5;
    }

    &:hover {
        background-color: #f0f0f0;
    }
}

.search-list-flex1 {
    flex: 1;
}

.search-list-flex2 {
    flex: 2;
}

.search-list-flex3 {
    flex: 3;
}

.search-list-content-format.search-play-item {
    color: #1890ff;
    background-color: #dddddd;
}

.order {
    top: 50%;
    left: 60px;
    transform: translateY(-50%);
}

.hot-line {
    position: relative;
    height: 4px;

    > div {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 2px;
        background-color: #eeeeee,
    }
}
</style>
