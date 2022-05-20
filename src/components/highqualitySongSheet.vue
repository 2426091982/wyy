<script lang='ts' setup>
import { getTopPlaylistHighquality } from "@/api";
import { SongSheetData } from "@/store/types/songSheet";
import { HighqualitySheetData } from "@/types/songSheet";
import { ref } from "@vue/reactivity";
import { useRoute } from "vue-router";
import highqualitySongSheetCard from "./highqualitySongSheetCard.vue";
import lazyLoading from "./lazyLoading.vue";


const route = useRoute();
const cat = route.params.cat as string;
const playList = ref<SongSheetData[]>([]);

let limit = 20;
let last = -1;

const list = async () => {
    const { 
        code, 
        lasttime,
        playlists,
    } =  await getTopPlaylistHighquality(cat, limit, last) as HighqualitySheetData;
    if (code === 200) {
        last = lasttime;
        playList.value.length === 0 
            ? playList.value = playlists 
            : playList.value.push(...playlists);
    }
};

const observer = (el: HTMLDivElement) => {
    const ob = new IntersectionObserver((entrys) => {
        if (entrys[0].intersectionRatio > 0) list();
    }, {
        rootMargin: '0px 0px 0px 0px',
    });
    ob.observe(el);
};

list();
</script>

<template>
    <div class="highquality-container">
        <h2>精品歌单</h2>
        <highqualitySongSheetCard :list="playList"></highqualitySongSheetCard>
        <lazyLoading @observer="observer"></lazyLoading>
    </div>
</template>

<style lang='less'>
.highquality-container {
    padding: 0 10px;

    h2 {
        margin: 20px 0;
        font-weight: 700;
    }
}
</style>
