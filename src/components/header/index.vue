<script lang="ts" setup>
import { SearchOutlined, UserOutlined } from '@ant-design/icons-vue';
import { ref } from '@vue/reactivity';
import historicalRecords from './historicalRecords.vue';

let value = ref('');
let onSearch = () => {
    console.log('搜索');
};
</script>

<template>
    <a-layout-header class="header" style="padding: 0">
        <div class="flex-item">
            <div class="logo">
                <img src="/images/logo1.png" alt="logo">
                网抑云音乐
            </div>
            <div class="historical">
                <historical-records></historical-records>
            </div>
            <div class="search">
                <a-input v-model:vlaue="value" placeholder="大家都在搜索" @keydown.enter="onSearch">
                    <template v-slot:prefix>
                        <search-outlined style="color: #fff" @click="onSearch"/>
                    </template>
                </a-input>
            </div>
        </div>
        <div class="flex-item">
            <div v-if="true">
                <a-space>
                    <a-avatar>
                        <template #icon><user-outlined class="pointer" @click="$emit('changeShowLogin')" /></template>
                    </a-avatar>
                    <span class="login pointer" @click="$emit('changeShowLogin')">未登录</span>
                </a-space>
            </div>
        </div>
    </a-layout-header>
</template>

<style lang="less">
.header {
    display: flex;
    height: 60px;
    justify-content: space-between;
    background-color: #1890ff;
    
    .flex-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex: 50%;
        color: #ffffff;

        &:last-child {
            padding-right: 30px;
            justify-content: flex-end;
        }
    }
}

.logo {
    width: 200px;
    height: 60px;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 2px;
    text-align: center;
    user-select: none;
    cursor: pointer;
    
    img {
        width: 30px;
        height: 30px;
    }
}

.historical {
    display: flex;
    margin-left: 30px;
    margin-right: 15px;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.search  {
    .ant-input-affix-wrapper {
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 20px;
    }

    .ant-input {
        padding-left: 10px;
        outline: 0;
        border: none;
        background-color: rgba(255, 255, 255, 0);
        caret-color: #ffffff;
        &::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
    }
}

.pointer {
    cursor: pointer;
}

.login {
    color: #dddddd;
    transition: color 0.2s;
    
    &:hover {
        color: #ffffff;
    }
}
</style>
