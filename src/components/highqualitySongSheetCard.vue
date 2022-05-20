<script lang='ts' setup>
import { 
    CrownOutlined,
    CaretRightOutlined
} from '@ant-design/icons-vue';
import { playListDetail } from "@/utils/sheetSong";
import { SongSheetData } from "@/store/types/songSheet";
import { PropType } from "@vue/runtime-core";
import { playListSong } from '@/utils/song';
import { getPlayListAll } from '@/api';
import { PlayListInfo } from '@/store/types/playList';

defineProps({
    list: {
        type: Array as PropType<SongSheetData[]>,
    },
});

/**
 * @param id 歌单ID
 */
const playSong = async (id: number) => {
    const {
        code,
        songs,    
    } = await getPlayListAll<{ code: number, songs: PlayListInfo[]}>(id);
    if (code === 200) {
        let index = 0;
        const callBack = () => {
            playListSong(songs[index], index, songs, id, callBack);
            index++;
        };
        callBack();
    }
}
</script>

<template>
    <div v-if="list" class="highquality-list">
        <div v-for="(item, key) in list" :key="key" class="highquality-item">
            <div class="highquality-img">
                <div class="tabs-top base-absolute">
                    <crown-outlined />
                </div>
                <img :src="item.picUrl || item.coverImgUrl + '?param=135y135'">
                <div class="play-song-but base-absolute showLatelyList" @click="playSong(item.id)">
                    <caret-right-outlined class="base-size22px base-pointer" />
                </div>
            </div>
            <div class="highquality-detail">
                <router-link 
                    :to="`/songSheet/${item.id}`"
                    class="highquality-title base-pointer" 
                    @click="playListDetail(item.id)"
                >{{ item.name }}</router-link>
                <div class="highquality-author base-pointer">by {{ item.creator.nickname }} </div>
            </div>
        </div>
    </div>
</template>

<style lang='less'>
.highquality-list {
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
}

.highquality-img {
    position: relative;
    width: 135px;
    height: 135px;
    
    img {
        border-radius: 8px;
    }

    .tabs-top {
        top: 0;
        left: 0;
        border-top: 20px solid rgb(209, 173, 15);
        border-left: 20px solid rgb(209, 173, 15);
        border-bottom: 20px solid transparent;
        border-right: 20px solid transparent;
        border-radius: 8px 0 0 0;
        color: #ffffff;
        
        span {
            position: absolute;
            top: -15px;
            left: -15px;
        }
    }
}

.highquality-item {
    display: flex;
    width: 30%;
    align-items: center;
    gap: 10px;
}

.highquality-detail {
    display: flex;
    padding-top: 20px;
    flex-direction: column;
    height: 100%;
    gap: 5px;
}

.highquality-title {
    color: #000000;
    font-size: 13px;
}

.highquality-author {
    color: #666666;
    font-size: 12px;

    &:hover {
        color: #000000;
    }
}
</style>
