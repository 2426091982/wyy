<script lang="ts" setup>
import { 
    RightOutlined,
    LeftOutlined 
} from '@ant-design/icons-vue';
import { ref } from '@vue/reactivity';

let isCannotLeft = ref(true); // 是否已经达到顶点或初始
let isCannotRight = ref(false); // 是否已经达到顶点或初始
</script>

<template>
    <div class="arrow-round" :style="{ opacity: isCannotLeft ? 0.5 : 1, }">
        <left-outlined />
    </div>
    <div class="arrow-round" :style="{ opacity: isCannotRight ? 0.5 : 1, }">
        <right-outlined />
    </div>
</template>

<style lang="less">
.arrow-round {
    display: flex;
    width: 26px;
    height: 26px;
    color: #fff;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
}
</style>
