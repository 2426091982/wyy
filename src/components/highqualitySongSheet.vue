<script lang='ts' setup>
import { getTopPlaylistHighquality } from "@/api";
import { SongSheetData } from "@/store/types/songSheet";
import { HighqualitySheetData } from "@/types/songSheet";
import { ref } from "@vue/reactivity";
import { useRoute } from "vue-router";
import highqualitySongSheetCard from "./highqualitySongSheetCard.vue";


const route = useRoute();
const cat = route.params.cat as string;
const playList = ref<SongSheetData[]>([]);

const list = async () => {
    const { 
        code, 
        lasttime,
        playlists,
        total,
    } =  await getTopPlaylistHighquality(cat) as HighqualitySheetData;
    if (code === 200) {
        playList.value = playlists;
    }
};
list();
</script>

<template>
    <div>
        <h2>精品歌单</h2>
        <highqualitySongSheetCard :list="playList"></highqualitySongSheetCard>
    </div>
</template>

<style lang='less'>

</style>
