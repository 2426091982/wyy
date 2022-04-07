<script lang='ts' setup>
import { 
    useRoute, 
    useRouter 
} from "vue-router";
import { 
    CaretDownOutlined,
    CaretUpOutlined,
    LeftOutlined,
    LikeOutlined,
    FolderAddOutlined,
    CloudUploadOutlined,
    PlayCircleOutlined
} from "@ant-design/icons-vue";
import { onMounted, ref } from "@vue/runtime-core";
import { getMvDetail, getMVInfo, getMvUrl, getRecommmendMv, mvSub, resourceLike } from "@/api";
import { message } from "ant-design-vue";
import { MvDetailData, MvInfo, MvRecommendData, MvUrlData } from "@/types/mv";
import { handlePlayTime, parseArtists, parsePlayCount } from "@/utils";
import { Artists } from "@/store/types/user";
import { watch } from "vue";
import { useStore } from "@/store";
type DetailData = MvDetailData & { 
    artist: Artists;
    liked: boolean;
    likedCount: number;
};

const store = useStore();
const router = useRouter();
const route = useRoute();
const mvid = ref(+route.params.id);
const video = ref<HTMLVideoElement>();
const src = ref('');
const show = ref(false);
const liked = ref(false);
const subed = ref(false);
const recommmendMv = ref<MvRecommendData[]>([]);
const mvDetail = ref<DetailData>({} as DetailData);

const handleLike = async () => {
    liked.value = !liked.value;
    message.success(liked.value ? '已点赞' : '已取消点赞');
    liked.value ? mvDetail.value.likedCount++ : mvDetail.value.likedCount--;
    await resourceLike(Number(liked.value), 1, mvDetail.value.id);
};

const handleSub = async () => {
    subed.value = !subed.value;
    subed.value ? mvDetail.value.subCount++ : mvDetail.value.subCount--;
    message.success(subed.value ? '可在我的收藏中查看' : '已取消收藏');
    await mvSub(mvDetail.value.id, Number(subed.value));
};

const init = async () => {
    mvid.value = +route.params.id;
    const { code, url, } = await getMvUrl(mvid.value) as MvUrlData;

    if (code !== 200) {
        router.back();
        message.error('MV地址异常，请稍后再试！');
        return;
    }

    src.value = url;

    const {
        liked: like,
        likedCount,
    } = await getMVInfo(mvid.value) as MvInfo;
    const { 
        artistId,
        artistName,
        artists,
        desc,
        id,
        name,
        playCount,
        publishTime,
        shareCount,
        subCount,
        subed: sub,
    } = await getMvDetail(mvid.value) as MvDetailData;
    
    mvDetail.value.artistId = artistId;
    mvDetail.value.artistName = artistName;
    mvDetail.value.artist = artists[0];
    mvDetail.value.artists = parseArtists(artists) as unknown as Artists[];
    mvDetail.value.desc = desc;
    mvDetail.value.id = id;
    mvDetail.value.name = name;
    mvDetail.value.playCount = playCount;
    mvDetail.value.publishTime = publishTime;
    mvDetail.value.shareCount = shareCount;
    mvDetail.value.subCount = subCount;
    mvDetail.value.liked = like;
    mvDetail.value.likedCount = likedCount;
    liked.value = like;
    subed.value = sub;

    const { mvs, } = await getRecommmendMv(mvid.value) as { code: number, mvs: MvRecommendData[] };
    recommmendMv.value = mvs;
};

onMounted(async () => {
    store.commit('currentMusic/clearState');
    init();
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (!video.value?.paused) {
                video.value?.pause();
            } else {
                video.value?.play();
            }
        }
    });
});

watch(
    () => route.params.id,
    (n) => n ? init() : null
);
</script>

<template>
    <div v-if="mvDetail.id" class="column">
        <div class="mv-info">
            <h3 class="base-pointer" @click="router.push('/')">  
                <left-outlined></left-outlined>
                MV详情
            </h3>
            <div class="video">
                <video 
                    ref="video" 
                    class="base-pointer"
                    :src="src" 
                    autoplay
                    controls
                    disablePictureInPicture="true"
                    controlslist="nodownload"
                    width="100%"
                    height="360"
                />
            </div>
            <div class="mv-artists">
                <a-avatar :size="50" :src="mvDetail.artist.img1v1Url + '?param=50y50'" />
                <span> {{ mvDetail.artists }}</span>
            </div>
            <h1 class="mv-name">
                {{ mvDetail.name }}
                <span class="base-pointer" @click="show = !show">
                    <caret-up-outlined v-if="show" />
                    <caret-down-outlined v-else />
                </span>
            </h1>
            <div class="publishTime-playCount">
                <span>发布于：{{ mvDetail.publishTime }}</span>
                <span>播放：{{ parsePlayCount(String(mvDetail.playCount)) }}</span>
            </div>
            <p v-show="show" class="mv-desc"> {{ mvDetail.desc }} </p>

            <div class="mv-btns">
                <a-button 
                    :class="liked ? 'like' : ''" 
                    shape="round" 
                    @click="handleLike"
                >
                    <template #icon>
                        <like-outlined/>
                    </template>
                    赞( {{ mvDetail.likedCount }} )
                </a-button>
                <a-button 
                    :class="subed ? 'like' : ''" 
                    shape="round" 
                    @click="handleSub"
                >
                    <template #icon>
                        <folder-add-outlined />
                    </template>
                    收藏( {{ mvDetail.subCount }} )
                </a-button>
                <a-button shape="round" @click="message.info('暂不支持')">
                    <template #icon>
                        <cloud-upload-outlined />
                    </template>
                    分享( {{ mvDetail.shareCount }} )
                </a-button>
            </div>
        </div>
        <div class="about-recommend">
            <h3>相关推荐</h3>
            <div class="recommmend-mv">
                <div 
                    v-for="(item) in recommmendMv" 
                    class="recommmend-mv-item" 
                    :key="item.id"
                >
                    <div class="recommend-mv-img base-pointer" @click="router.push(`/mv/${item.id}`)">
                        <span class="play-count base-absolute"> <play-circle-outlined /> {{ parsePlayCount(String(item.playCount)) }}</span>
                        <span class="play-duration base-absolute">{{ handlePlayTime(item.duration / 1000) }}</span>
                        <img :src="item.cover + '?param=140y90'" width="140" height="90">
                    </div>
                    
                    <div class="recommmend-mv-detail">
                        <p class="ellipsis">{{ item.name }}</p>
                        <span class="base-pointer ellipsis">by {{ parseArtists(item.artists) }}</span>
                    </div>
                </div>  
            </div>
        </div>
    </div>
</template>

<style lang='less'>
.column {
    display: flex;
    margin: 0 auto;
    width: 930px;
    gap: 35px;

    h3 {
        margin-top: 10px;
        font-weight: 700;
    }
}

.mv-info {
    width: 680px;
}

.mv-name {
    font-size: 22px;
    font-weight: 700;
}

.video {
    width: 100%;
    padding: 0 20px;
    background-color: black;

    video {
        width: 100%;
    }
}

.mv-artists {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 10px 0;
    color: #999999;

    &:hover {
        color: #333333;
    }
}

.like {
    border-color: #1890ff !important;
    color: #1890ff !important;
}

.mv-desc {
    color: #000;
    font-size: 14px;
}

.mv-btns {
    display: flex;
    gap: 10px;
}

.publishTime-playCount {
    display: flex;
    margin: 10px 0;
    color: #999999;
    gap: 30px;
}

.recommmend-mv-item {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.recommend-mv-img {
    position: relative;

    img {
        border-radius: 8px;
    }

    .play-duration {
        bottom: 10px;
        right: 10px;
        color: #ffffff;
        font-size: 12px;
    }
}

.recommmend-mv-detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    p {
        display: -webkit-box;
        width: 110px;
        white-space: pre-wrap;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    span {
        width: 110px;
        color: #999999;
        font-size: 12px;

        &:hover {
            color: #333333;
        }
    }
}
</style>
