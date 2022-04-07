<script lang='ts' setup>
import { getSearch } from "@/api";
import { RecommendSongsData } from "@/store/types/recommendSongs";
import { Response } from "@/types/base";
import { SearchReslute } from "@/types/search";
import { onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import SearchList from "@/components/search/searchList.vue";
import LazyLoading from "@/components/lazyLoading.vue";
import Loading from "@/components/loading.vue";
import { handleSymbol } from "@/utils/search";

const total = ref(0);
const route = useRoute();
const loading = ref(false);
const listData = ref<RecommendSongsData[]>([]);
const keyword = ref(route.params.keyword as string);

let limit = 30;
let offset = 0;

const init = async () => {
    if (listData.value.length >= total.value && total.value !== 0) return;
    loading.value = true;
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
    loading.value = false;
};

const observer = (el: HTMLDivElement) => {
    const ob = new IntersectionObserver(async (entrys) => {
        if (entrys[0].intersectionRatio > 0) {
            await init();
        }
    });
    ob.observe(el);
    onBeforeUnmount(() => ob.unobserve(el));
};

watch(
    () => route.params.keyword,
    (n) => {
        if (!n) return;
        offset = 0;
        listData.value = [];
        keyword.value = `${n}`;
        init();
    }
);
</script>

<template>
    <div>
        <h1 class="search-keyword">搜索&nbsp; {{ keyword }} </h1>
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
