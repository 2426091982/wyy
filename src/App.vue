<script setup lang="ts">
import { 
    getLoginStatus, 
    mountData 
} from './utils';
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import { useStore } from '@/store';
import Header from '@/components/header/index.vue';
import routes from '@/router/routes';
import Login from '@/views/user/index.vue';
import Player from '@/components/footer/index.vue';


let store = useStore();
let router = useRouter();
let selectedKeys = ref(['-1']);

window.addEventListener('online', () => (store.state.onLine = true));
window.addEventListener('offline', () => (store.state.onLine = false));

// 验证登录
onMounted(async () => {
    const profile = await getLoginStatus();
    if (profile != null) {
        mountData(profile, '自动登录成功');
    } else {
        message.warn('您还没有登录哦~');
    }
});

watch( // 观察当前路由的meat有没有name，没有则不会选中导航栏
    () => router.currentRoute.value, 
    (now) => {
        const key = now.meta.key as string ?? '-1';
        selectedKeys.value = [key];
    }
);
</script>

<template>
    <a-layout style="width: 100%; height: 100%">
        <Header></Header>
        <a-layout>
            <a-layout-sider theme='light'>
                <a-menu 
                    v-model:selectedKeys="selectedKeys" 
                    mode="inline"
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
            <a-layout-content class="main">
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
        <a-layout-footer>
            <player></player>
        </a-layout-footer>
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
    border-radius: 2px;
    background: #fff;
    box-shadow: none;
}

:hover::-webkit-scrollbar-track {
    box-shadow: inset 0px 0px 10px #999;
}

::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 10px;
}

:hover::-webkit-scrollbar-thumb {
    background: #666666;
    box-shadow: 0px 0px 10px #666;
}

::-webkit-scrollbar-thumb:hover {
    background: #999999;
}

::-webkit-scrollbar-corner {
    background: #204754;
}

:hover:-webkit-scrollbar-corner {
    background: transparent;
}

::selection {
    background-color: #1890ff;
}

#app {
    width: 100%;
    height: 100%;
    color: #333;
    font-family: '微软雅黑 Light';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

.ant-menu  {
    //border-right: 1px solid #f0f0f0;
    height: 100%;
}

.base-size16px {
    font-size: 16px;
}

.base-size20px {
    font-size: 20px;
}

.base-pointer {
    cursor: pointer;
}

.base-text-center {
    text-align: center;
}

.ant-layout-content {
    padding: 15px 30px;
    background-color: #ffffff;
}

.main {
    width: 100%;
    height: 100%;
    min-width: 495px;
    overflow-x: hidden;
    overflow-y: scroll;
}

.ant-layout-footer {
    display: flex;
    padding: 10px 20px;
    min-width: 665px;
    height: 80px;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f0f0f0;
    background-color: #ffffff;
    user-select: none;
}
</style>
