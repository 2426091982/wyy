<script lang='ts' setup>
import { RightOutlined } from "@ant-design/icons-vue";

defineProps({
    title: String,
    path: String,
});
</script>

<template>
    <div class="title">
        <router-link :to="path" class="title-link">
            <h2>{{ title }}</h2>
            <right-outlined class="base-size18px" />
        </router-link>
    </div>
</template>

<style lang='less'>
.title {
    margin-top: 30px;
    margin-bottom: 10px;
    
    h2 {
        margin-bottom: 0;
        font-size: 18px;
        font-weight: 700;
        color: #555555;

        &:hover {
            color: #333333;
        }
    }
}

.title-link {
    display: flex;
    width: 95px;
    align-items: center;
    color: #666666;

    &:hover {
        color: #666666;
    }
}
</style>
