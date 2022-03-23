, PlainSongSheetDataimport { HighqualitySheetData } from "@/types/songSheet";
<script lang='ts' setup>
import { 
    CrownOutlined,
    RightOutlined,
    GlobalOutlined,
    InsertRowBelowOutlined,
    CoffeeOutlined,
    SmileOutlined,
    AppstoreOutlined
} from "@ant-design/icons-vue";
import { 
    getPlaylistCatlist,
    getPlaylistHot, 
    getTopPlaylist, 
    getTopPlaylistHighquality 
} from "@/api";
import { 
    SongSheetData, 
    Tag, 
    Tags, 
    TagsData
} from "@/store/types/songSheet";
import { Response } from "@/types/base";
import { onMounted } from "@vue/runtime-core";
import { ref, watch } from "@vue/runtime-dom";
import { useStore } from "@/store";
import { handleTags } from "@/utils";
import sheetSongCard from "@/components/sheetSongCard.vue";
import { useRouter } from "vue-router";
import { HighqualitySheetData, PlainSongSheetData } from "@/types/songSheet";

const store = useStore();
const router = useRouter();
const songSheetData = store.state.songSheet;
const observer = ref<HTMLDivElement>();
const playlists = ref<SongSheetData[]>([]);
const cat = ref(songSheetData.tagMame);
const hotTags = ref<Tags[]>([]);
const tags = ref<Tag[][]>([]);
const all = ref<Tag>({} as Tag)                                                        ;
const categories = ref<string[]>([]);
const showTagList = ref(false);
const showPagination = ref(false);
const total = ref(0);
const current = ref(1);
const tagList = ref<HTMLDivElement | null>(null);
const highqualityData = ref<SongSheetData>();

let lastTime = -1;
let limit = 20;
let offset = 0;

const selectTag = (tag: Tag | Tags) => {
    cat.value = tag.name;
    store.commit('songSheet/tagMame', cat.value);
};

/**
 * 获取精品歌单数据
 */
const topPlaylistHighquality = async (cat: string) => {
    const {
        code,
        lasttime,
        playlists: playList,
        total,
    } = await getTopPlaylistHighquality(cat) as HighqualitySheetData;
    if (code === 200) {
        highqualityData.value = playList[0];
        lastTime = lasttime;
    }
};

/**
 * 获取普通歌单数据
 */
const topPlaylist = async (cat: string, change = false) => {
    if (offset >= total.value && total.value !== 0) return showPagination.value = true;
    const {
        code,
        playlists: playList,
        total: size,
    } = await getTopPlaylist(cat, limit, offset) as PlainSongSheetData;
    if (code === 200) {
        offset += limit;
        total.value = size;
        !playlists.value.length || change ? playlists.value = playList :  playlists.value.push(...playList);
        store.commit('songSheet/add', playList);
    }
};

/**
 * 页数改变
 */
const changePage = async (page: number, pageSize: number) => {
    showPagination.value = false;
    offset = (page - 1) * pageSize;
    await topPlaylist(cat.value, true);
};

onMounted(async () => {
    topPlaylistHighquality(cat.value);
    topPlaylist(cat.value);
    { // 获取热门分类标签
        const {
            code,
            tags,
        } = await getPlaylistHot() as Response & { tags: Tags[] };
        if (code === 200) {
            store.commit('songSheet/hotTag', tags[0]);
            hotTags.value = tags;
        }
    }
    
    { // 获取分类标签列表
        const {
            code,
            categories: subTitle,
            all: main,
            sub,
        } = await getPlaylistCatlist() as Response & TagsData;
        if (code === 200) {
            tags.value = handleTags(subTitle, sub);
            categories.value = subTitle;
            all.value = main;
        }
    }

    if (observer.value) {
        const option = {
            rootMargin: '0px 0px 0px 0px',
            threshold: 0,
        };
        const ob = new IntersectionObserver((entrys) => {
            if (playlists.value.length >= 100 && observer.value) {
                showPagination.value = true;
                return;
            }
            if (entrys[0].intersectionRatio > 0) topPlaylist(cat.value);
        }, option);
        ob.observe(observer.value);
    }

    document.documentElement.addEventListener('click', (e) => {
        const el = e.target as HTMLElement;
        if (!el.contains(tagList.value)) showTagList.value = false;
    });
});

watch(
    () => cat.value,
    async (nCat: string) => {
        if (!nCat) return;
        await topPlaylist(nCat, true);
        await topPlaylistHighquality(nCat);
        offset = 0;
    }
);
</script>

<template>
    <div>
        <div v-if="highqualityData" class="highquality">
            <div class="highquality-bg base-absolute">
                <img :src="highqualityData.coverImgUrl" width="1100" alt="背景图片" >
            </div>
            <div class="highquality-detail">
                <img :src="highqualityData.coverImgUrl + '?param=140y140'" width="140" height="140" alt="">
                <div class="highquality-body">
                    <div>
                        <a-button class="highquality-btn" ghost shape="round" @click="router.push(`/highquality/${cat}`)">
                            <template #icon>
                                <crown-outlined />
                            </template>
                            精品歌单
                        </a-button>
                    </div>
                    <h3 style="color: #ffffff">{{ highqualityData.name }}</h3>
                    <p class="base-size12px" style="color: #cccccc">{{ highqualityData.copywriter }}</p>
                </div>
            </div>
        </div>
        <div class="play-list-cats">
            <a-button 
                class="select-cats" 
                shape="round"
                @click.stop="showTagList = !showTagList"
            >
                {{ cat }}
                <right-outlined />
            </a-button>
        
            <ul class="list-cats">
                <li v-for="tag in hotTags" :key="tag.id">
                    <span 
                        :class="`cats-name base-pointer ${tag.name === cat ? 'cats-active' : ''}`"
                        @click.stop="selectTag(tag)"
                    > {{ tag.name }} </span>
                </li>
            </ul>

            <div v-show="showTagList" ref="tagList" class="tag-list base-absolute">
                <div class="tag-all">
                    <span 
                        :class="`cats-name base-pointer ${'全部歌单' === cat ? 'cats-active' : ''}`"
                        @click="selectTag(all)"
                    > 全部歌单 </span>
                </div>
                <div 
                    v-for="(tag, key) in tags" 
                    :key="key" 
                    class="tag-list-item"
                >
                    <div class="tag-list-title">
                        <global-outlined class="sub-title-icon" v-if="key === 0" />
                        <insert-row-below-outlined class="sub-title-icon" v-else-if="key === 1"/>
                        <coffee-outlined class="sub-title-icon" v-else-if="key === 2" />
                        <smile-outlined class="sub-title-icon" v-else-if="key === 3" />
                        <appstore-outlined class="sub-title-icon" v-else-if="key === 4" />
                        <span> 
                            {{ categories[key] }}
                        </span>
                    </div>
                    <ul class="list-cats sub-list-cats">
                        <li 
                            v-for="item in tag"
                            :key="item.name"
                            class=""
                        >
                            <span 
                                :class="`cats-name base-pointer ${item.name === cat ? 'cats-active' : ''}`"
                                @click="selectTag(item)"
                            > 
                                {{ item.name }}
                                <span v-if="item.hot" class="cats-hot" >HOT</span> 
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="song-sheet-list">
            <sheetSongCard :songSheet="playlists"></sheetSongCard>
            <div ref="observer" class="observer"></div>
        </div>
        <a-pagination 
            v-if="showPagination"
            v-model:current="current" 
            :pageSize="100"
            :total="total" 
            :pageSizeOptions="['100']"
            @change="changePage"
            class="pagination"
            hideOnSinglePage 
            show-less-items
        />
    </div>
</template>

<style lang='less'>
.pagination {
    text-align: center;
}

.observer {
    width: 100%;
    height: 1px;
}

.highquality {
    position: relative;
    width: 1100px;
    height: 170px;
    padding: 15px;
    border-radius: 8px;
    overflow: hidden;
}

.highquality-bg {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(50px);
    filter: blur(50px);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.2);
    }
}

.highquality-detail {
    position: relative;
    display: flex;
    gap: 10px;

    img {
        border-radius: 8px;
        filter: brightness(95%)
    }
}

.highquality-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;

    h3 {
        margin: 0;
    }
}

.highquality-btn {
    border: 1px solid rgb(231, 193, 23);
    color: rgb(231, 193, 23);

    &:hover,
    &:focus {
        border: 1px solid rgb(209, 173, 15);
        color: rgb(209, 173, 15);
    }
}

.select-cats {

    &:hover {
        color: #333333;
        border: 1px solid #cccccc;
        background-color: #f9f9f9f9;
    }

    &:focus {
        color: #333333;
        border: 1px solid #cccccc;
    }

    .anticon-right {
        color: #999999;
    }
}

.list-cats {
    display: flex;
    flex-wrap: wrap;
}

.play-list-cats {
    position: relative;
    display: flex;
    padding: 20px 0;
    justify-content: space-between;
}

.cats-name {
    padding: 2px 15px;
    user-select: none;

    &:hover {
        color: #1890ff;
    }
}

.sub-title-icon {
    margin-right: 10px;
    color: #999999;
    font-size: 24px;
}

.cats-active {
    border-radius: 20px;
    color: #0381f7;
    background-color: #abd2f7;
}

.tag-list {
    top: 60px;
    left: 0px;
    width: 775px;
    padding-bottom: 80px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px #cccccc;
    background-color: #ffffff;
    z-index: 1000;
}

.tag-all {
    padding: 20px;
    border-bottom: 1px solid #e2e2e2;    
}

.sub-list-cats {
    margin: 0;
    padding: 0;
    flex: 1;
    gap: 10px 27px;

    li {
        width: 80px;
        white-space: nowrap;
    }
}

.tag-list-title {
    display: flex;
    align-items: center;
    width: 100px;
    color: #999999;
}

.tag-list-item {
    display: flex;
    margin-top: 50px;
    padding: 0 20px;
    gap: 20px;
}

.cats-hot {
    display: inline-block;
    position: relative;
    top: -5px;
    right: 4px;
    color: red;
    font-size: 12px;
    font-weight: 900;
    transform: scale(0.7);
}
</style>
