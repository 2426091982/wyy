<script setup lang='ts'>
import { reactive } from "@vue/reactivity";

const props = defineProps({
    listHeight: {
        type: Number,
        default: 500
    },
    itemHiehgt: {
        type: Number,
        default: 1000
    },
    itemTotal: {
        type: Number,
        default: 20
    },
});

const visibleStyle = reactive({
    height: props.listHeight,
});

const containerStyle = reactive({
    height: props.itemTotal! * props.itemHiehgt!,
});
</script>

<template>
    <div 
        class="virtual-list-visible"
        :style="visibleStyle"
    >
        <div 
            class="virtual-list-container"
            :style="containerStyle"
        >
            <slot></slot>
        </div>
    </div>
</template>

<style lang='less'>

</style>
