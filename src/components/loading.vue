<script lang='ts' setup>
import OutIn from './out-in.vue';

const { top } = defineProps({
    size: {
        type: String,
        default: 'default',
    },
    loading: Boolean,
    height: String,
    top: String,
});

const position = {
    position: top ? 'absolute': '',
    top,
};

</script>

<template>
    <out-in>
        <div 
            v-if="loading" 
            class="loading" 
            :style="{ height: height }"
        >
            <a-spin 
                tip="加载中..." 
                :size="size" 
                :style="position" 
            />
        </div>
        <slot v-else></slot>
    </out-in>
</template>

<style lang='less'>
.loading {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}
</style>
