<script lang='ts' setup>
import { 
    watch, 
    PropType, 
    ref 
} from '@vue/runtime-core';
import { CurrentMusicState } from '@/store/types/CurrentMusic';
import { nextTick } from 'vue';

const { currentMusic,} = defineProps({
    currentMusic: {
        type: Object as PropType<CurrentMusicState>,
        required: true,
    },
});

const audio = ref<HTMLAudioElement>();




watch(
    currentMusic, 
    ({play, }) => {
        /* 开始播放和暂停播放 */
        nextTick(async () => {
            if(audio.value == undefined) return;
            if (play) {
                await audio.value.play();
            } else {
                audio.value.pause();
            }
        });
    }
);
</script>

<template>
    <audio 
        ref="audio" 
        :src="currentMusic.url" 
        style="display: none"
    ></audio>
</template>

<style lang='less'>
</style>
