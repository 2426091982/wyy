<script lang='ts' setup>
import { SongSheetData } from "@/store/types/songSheet";
import { CrownOutlined } from '@ant-design/icons-vue';
import { PropType } from "@vue/runtime-core";

defineProps({
    list: {
        type: Array as PropType<SongSheetData[]>,
    },
});
</script>

<template>
    <div v-if="list" class="highquality-list">
        <div v-for="(item, key) in list" :key="key" class="highquality-item">
            <div class="highquality-img">
                <div class="base-absolute">
                    <crown-outlined />
                </div>
                <img :src="item.picUrl || item.coverImgUrl + '?param=135y135'" alt="" width="135" height="135">
            </div>
            <div class="highquality-detail">
                <div class="highquality-title">{{ item.name }}</div>
                <div class="highquality-author"> {{ item.description }} </div>
            </div>
        </div>
    </div>
</template>

<style lang='less'>
.highquality-list {
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    justify-content: space-between;
    gap: 20px;
}

.highquality-img {
    position: relative;
    border-radius: 8px;

    .base-absolute {
        top: 0;
        left: 0;
        border-top: 10px solid #rgb(209, 173, 15);
        color: #ffffff;
    }
}

.highquality-item {
    flex-basis: 30%;
}

.highquality-detail {
    display: flex;
    height: 100%;
}
</style>
