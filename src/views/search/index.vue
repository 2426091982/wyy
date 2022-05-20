<script lang='ts' setup>
import { getSearch } from "@/api";
import { RecommendSongsData } from "@/store/types/recommendSongs";
import { Response } from "@/types/base";
import { SearchReslute } from "@/types/search";
import { onBeforeUnmount, ref, watch } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import SearchList from "@/components/search/searchList.vue";
import LazyLoading from "@/components/lazyLoading.vue";
import Loading from "@/components/loading.vue";
import { handleSymbol } from "@/utils/search";

/**
 * 数据比较少的时候可能observer和watch会同时触发
 * 所以需要一个等待的条件，让他们只触发一个
 */
let wait = false;
let limit = 30;
let offset = 0;
const total = ref(0);
const route = useRoute();
const loading = ref(false);
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
    if (code === 200) {
        offset += limit;
        listData.value.push(...songs);
        total.value = songCount;
    }
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

watch(
    () => route.params.keyword,
    (n) => {
        if (!n || wait) return;
        loading.value = true;
        listData.value = [];
        total.value = offset = 0;
        keyword.value = `${n}`;
        init();
        loading.value = false;
    }
);
</script>

<template>
    <div>
        <h1 class="search-keyword">搜索&nbsp; {{ keyword }} </h1>
        <span>搜索到 <mark>{{ total }}</mark> 条</span>
        <Loading 
            :loading="loading"
            :top="`200px`"
        >
            <div>
                <SearchList 
                    :songList="listData"
                    :keyword="keyword" 
                ></SearchList>
                <LazyLoading @observer="observer"></LazyLoading>
            </div>
        </Loading>
    </div>
</template>

<style lang='less'>
.search-keyword {
    margin-top: 20px;
    font-size: 22px;
    font-weight: 700;
}
</style>
