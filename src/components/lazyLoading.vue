<script lang='ts' setup>
import { onMounted, ref } from "@vue/runtime-dom";


const emits = defineEmits(['observer']);


const observer = ref<HTMLDivElement>();

onMounted(() => {
    if (observer.value) {
        emits('observer', observer.value);
    }
});
</script>

<template>
    <div ref="observer" class="observer">
        <slot>
            <div>正拼命加载中...</div>
        </slot>
    </div>
</template>

<style lang='less'>
.observer {
    width: 100%;
    padding: 10px;
    text-align: center;
    color: #999999;
}
</style>
