<script lang='ts' setup>
import { getSearch } from "@/api";
import { RecommendSongsData } from "@/store/types/recommendSongs";
import { Response } from "@/types/base";
import { SearchReslute } from "@/types/search";
import { onBeforeUnmount, ref, watch } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { handleSymbol } from "@/utils/search";
import SearchList from "@/components/search/searchList.vue";
import LazyLoading from "@/components/lazyLoading.vue";
import Loading from "@/components/loading.vue";
import http from '@/api/requset';

/**
 * 数据比较少的时候可能observer和watch会同时触发
 * 所以需要一个等待的条件，让他们只触发一个
 */
let wait = false;
let limit = 30;
let offset = 0;
const total = ref(0);
const route = useRoute();
const loading = ref(true);
const notFind = ref(false);
const listData = ref<RecommendSongsData[]>([]);
const keyword = ref(route.params.keyword as string);

const init = async () => {
    wait = true;
    if (listData.value.length >= total.value && total.value !== 0) return;
    const {
        code,
        result: {
            songCount,
            songs,
        },
    } = await getSearch(handleSymbol(keyword.value), limit, offset) as Response & SearchReslute;
    if (code === 200 && songCount) {
        offset += limit;
        listData.value.push(...songs);
        total.value = songCount;
    } else if (songCount === 0) {
        notFind.value = true;
    }
    loading.value = false;
    wait = false;
};

const observer = (el: HTMLDivElement) => {
    const ob = new IntersectionObserver(async (entrys) => {
        if (entrys[0].intersectionRatio > 0 && !wait) {
            await init();
        }
    });
    ob.observe(el);
    onBeforeUnmount(() => ob.unobserve(el));
};

init();

watch(
    () => route.params.keyword,
    (n) => {
        if (!n) return;
        loading.value = true;
        notFind.value = false;
        keyword.value = `${n}`;
        if (!wait) {
            listData.value.length = 0;
            total.value = 0;
            offset = 0;
            init();
        }
    }
);
</script>

<template>
    <h1 class="search-keyword">
        搜索&nbsp; {{ keyword }} 
    </h1>
    <Loading 
        :loading="loading"
        :top="`200px`"
    >
        <div>
            <div v-if="!notFind">
                <span>
                搜索到 <mark>{{ total }}</mark> 条
                </span>
                <div>
                    <SearchList 
                        :songList="listData"
                        :keyword="keyword" 
                    ></SearchList>
                    <LazyLoading 
                        v-if="total > listData.length"
                        @observer="observer"
                    ></LazyLoading>
                </div>
            </div>
            <span v-else>没有找到你想要的歌曲呢~</span>
        </div>
    </Loading>
</template>

<style lang='less'>
.search-keyword {
    margin-top: 20px;
    font-size: 22px;
    font-weight: 700;
}
</style>
