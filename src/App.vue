<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
import { onMounted } from '@vue/runtime-core';
import { message } from 'ant-design-vue';
import { getLoginStatus, mountData } from './utils';
import Header from '@/components/header/index.vue';
import routes from '@/router/routes';
import Login from '@/views/user/index.vue';


let selectedKeys = ref([sessionStorage.getItem('key') || '1']);
let sevaKey = (e: MenuInfo) => sessionStorage.setItem('key', `${e.key}`);

// 验证登录
onMounted(async () => {
    const profile = await getLoginStatus();
    if (profile !== null) {
        mountData(profile, '自动登录成功');
    } else {
        message.warn('您还没有登录哦~');
    }
});
</script>

<template>
    <a-layout style="width: 100%; height: 100%">
        <Header></Header>
        <a-layout>
            <!-- collapsible 收起 -->
            <a-layout-sider theme='light'>
                <a-menu 
                    v-model:selectedKeys="selectedKeys" 
                    mode="inline"
                    @click="sevaKey"
                >
                    <template v-for="route in routes">
                        <a-menu-item 
                            v-if="route.meta && route.meta?.name !== '我的音乐'" 
                            :key="route.meta?.key"
                        >
                            <router-link :to="route.path"> {{ route.meta?.name }} </router-link>
                        </a-menu-item>
                    </template>
                    <a-menu-item-group>
                        <template #title> 我的音乐 </template>
                        <a-menu-item key="112">本地下载</a-menu-item>
                        <a-menu-item key="113">最近播放</a-menu-item>
                    </a-menu-item-group>
                </a-menu>
            </a-layout-sider>
            <a-layout-content>
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
        <a-layout-footer>底部播放器</a-layout-footer>
    </a-layout>
    <Login></Login>
</template>

<style lang="less">
html,
body {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 2px;
    box-shadow: inset 0px 0px 10px #999;
}

::-webkit-scrollbar-thumb {
    background: #666;
    box-shadow: 0px 0px 10px #666;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #999;
}

::-webkit-scrollbar-corner {
    background: #204754;
}

#app {
    width: 100%;
    height: 100%;
    color: #333;
    font-family: '微软雅黑 Light';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.ant-menu  {
    //border-right: 1px solid #f0f0f0;
    height: 100%;
}

.pointer {
    cursor: pointer;
}

.textCenter {
    text-align: center;
}

.ant-layout-content {
    padding-top: 15px;
    padding-left: 30px;
    background-color: #fff;
}
</style>

function getLoginStatus() {
    throw new Error('Function not implemented.');
}
