<script lang='ts' setup>
import { 
    getBanners, 
    getNewSong, 
    getPrivateContent, 
    getRecommendSongSheet 
} from '@/api/recommend';
import { 
    onMounted, 
    ref, 
    watch
} from '@vue/runtime-core';
import { 
    parseBannerData, 
    parseNewSongData
} from '@/utils/parseData';
import { 
    CaretRightOutlined
} from '@ant-design/icons-vue';
import { parseArtists } from '@/utils';
import { songData } from '@/utils/song';
import { Banners } from '@/types/base';
import { SongSheetData } from '@/store/types/songSheet';
import { useStore } from '@/store';
import { PrivateContentData } from '@/store/types/privateContent';
import { NewSongData } from '@/store/types/newSong';
import { Response } from '@/types/base';
import { getRecommendResource, getStatus } from '@/api';
import Banner from '@/components/banner.vue';
import Title from '@/components/title.vue';
import PrivateContentCard from '@/components/privateContentCard.vue';
import sheetSongCard from '@/components/sheetSongCard.vue';
import Loading from '@/components/loading.vue';

const store = useStore();
const songSheet = ref<SongSheetData[]>([]);
const privateContent = ref<PrivateContentData[]>([]);
const newSong = ref<NewSongData[]>([]);
const bannerData = ref<Banners>([]);
const loading = ref(true);
const rSongId = ref(-1);

const playRSong = async ({ song, id, picUrl }: NewSongData) => {
    const { 
        br, 
        url,
    } = await songData(id);
    rSongId.value = id;
    const lately = store.state.playList.lately;
    const data = {
        artists: parseArtists(song.artists),
        br,
        id,
        likes: false,
        name: song.name,
        pic: picUrl,
        play: true,
        url,
    };
    store.commit('currentMusic/changeState',  data);
    store.commit('playList/updateState', data);
    store.commit('playList/changePlayList', {
        songs: lately,
        id: -1,
        size: lately.length,
    });
};

const getBannerData = async () => {
    return new Promise(async resolve => {
        let {
            code, 
            banners, 
        } = await getBanners() as Response & { banners: Banners };
        if (code === 200) {
            bannerData.value = parseBannerData(banners).splice(0, 8);
        }
        resolve('ok');
    });
};

const getRecommendSongsData = (change = false) => {
    return new Promise(async resolve => {
        let limit = 10;
        let len = 0;
        await getStatus();
        if (store.state.isLogin) {
            limit = 9;
            let {
                code,
                recommend,
            } = await getRecommendResource<Response & { recommend: SongSheetData[] }>();
            if (change) songSheet.value = [];
            if (code === 200) {
                songSheet.value = recommend.slice(0, limit);
                len = songSheet.value.length;
            }
        }
        if (!store.state.isLogin || len < 9) {
            let {
                code,
                result,
            } =  await getRecommendSongSheet(limit - len) as Response & { result: SongSheetData[] };
            if (code === 200) {  
                change 
                ?  songSheet.value = result 
                : songSheet.value.push(...result);
            }
        }
        resolve('ok');
    });
}

const getPrivateContentData = () => {
    return new Promise(async resolve => {
        let { 
        code, 
        result, 
        } = await getPrivateContent() as Response & { result: PrivateContentData[] };
        if (code === 200) {
            privateContent.value = result;
        }
        resolve('ok');
    });
};

const getNewSongsData = async () => {
    return new Promise(async resolve => {
        let { 
            code, 
            result, 
        } = await getNewSong() as Response & { result: NewSongData[] };
        if (code === 200) {
            newSong.value = parseNewSongData(result);
        }
        resolve('ok');
    });
};

onMounted(() => {
    Promise.all([
        getBannerData(), 
        getRecommendSongsData(),
        getPrivateContentData(),
        getNewSongsData()
    ]).then(() => loading.value = false);
});

watch(
    () => (store.state.isLogin), 
    (isLogin) => {
        if (songSheet.value.length === 10 && isLogin) {
            getRecommendSongsData();
        } else if (!isLogin) {
            getRecommendSongsData(true);
        }
    }
);
</script>

<template>
    <Loading top="200px" :loading="loading">
        <div>
            <Banner :imgList="bannerData"></Banner>
            <Title title="推荐歌单" path="/discoveMusic/songSheet"></Title>
            <div class="song-sheet-list">
                <sheetSongCard v-if="store.state.isLogin" dayRecommend ></sheetSongCard>
                <sheetSongCard :songSheet="songSheet" ></sheetSongCard>
            </div>
            <Title title="独家放送" path="/discoveMusic/"></Title>
            <PrivateContentCard :entry="true" :list="privateContent"></PrivateContentCard>
            <Title title="最新音乐" path="/discoveMusic/latestMusic"></Title>
            <div class="new-song-main">
                <div 
                    v-for="item in newSong" 
                    :class="`new-song base-pointer ${rSongId === item.id ? 'song-active' : ''}`" 
                    :key="item.id"
                >
                    <div class="new-song-ico">
                        <div 
                            class="play-song-but  base-absolute" 
                            @click="playRSong(item)"
                        >
                            <caret-right-outlined class="base-size18px" />
                        </div>
                        <img loading="lazy" :src="item.picUrl + '?param=50y50'">
                    </div>
                    <div class="new-song-info">
                        <div class="new-song-name ellipsis">
                            {{ item.name }}
                        </div>
                        <div class="new-song-artists ellipsis">
                            {{ parseArtists(item.song.artists) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Loading>
    
</template>

<style lang='less'>
.song-active {
    background-color: #cccccc;
}

.song-sheet-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: 520px;
    gap: 20px;
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

.new-song-info {
    width: 290px;
}

.new-song-artists {
    padding-top: 5px;
}
</style>
