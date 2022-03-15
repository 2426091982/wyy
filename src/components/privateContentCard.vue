<script lang='ts' setup>
import { PrivateContentData } from "@/store/types/privateContent";
import { CaretRightOutlined } from "@ant-design/icons-vue";
import { PropType } from "@vue/runtime-core";

defineProps({
    entry: Boolean,
    list: Array as PropType<PrivateContentData[]>,
});
</script>

<template>
    <div :class="`private-content-main ${entry ? 'entry' : ''}`">
        <div v-for="item in list" class="private-content-item" :key="item.id">
            <div class="private-content-bg base-pointer">
                <div class="private-play-but base-absolute">
                    <caret-right-outlined />
                </div>
                <img :src="entry ? item.sPicUrl : item.picUrl + '?param=350y200'" >
            </div>
            <div class="private-content-details">
                <span> {{ item.name }} </span>
            </div>
        </div>
    </div>
</template>

<style lang='less'>
.private-content-main {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 20px;

    img {
        width: 100%;
    }
}

.private-play-but {
    display: flex;
    top: 10px;
    left: 10px;
    width: 25px;
    height: 25px;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    background-color: rgba(0, 0, 0, .2);
    border: 1px solid #cccccc;
    border-radius: 50%;
}

.private-content-bg {
    position: relative;
    width: 350px;
    border-radius: 8px;
    overflow: hidden;
}
</style>
