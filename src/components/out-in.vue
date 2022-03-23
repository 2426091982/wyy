<script setup lang="ts">
import { PropType } from "@vue/runtime-core";

defineProps({
    mode: {
        type: String as PropType<'out-in' | 'default' | 'in-out'>,
        default: 'out-in',
    },  
});
</script>

<template>
    <transition name="out-in" :mode="mode">
        <slot></slot>
    </transition>
</template>

<style>
.out-in-enter-from,
.out-in-leave-to {
    opacity: 0 !important;
}

.out-in-enter-active,
.out-in-leave-active {
    transition: opacity 0.5s !important;
}
</style>
