<script lang="ts" setup>
import NavBar from '@/components/navBar/index.vue';
import routers from '@/router/routes';
import { NavBar as navBar } from '@/types/base';

let list = [] as navBar;
routers.forEach((router) => {
    let meta = router.meta;
    if (!meta) return;
    if (meta.name === '发现音乐') {
        router.children!.forEach((item) => {
            list.push({
                name: item.name as string,
                path: `${router.path}/${item.path}`,
            });
        });
    }
});
</script>

<template>
    <NavBar :list="list"></NavBar>
    <div class="main-base">
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component"/>
            </keep-alive>
        </router-view>
    </div>
</template>

<style lang="less">
.main-base {
    margin: 0 auto;
    max-width: 1100px;
    min-width: 760px;
}
</style>
