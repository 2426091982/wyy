<script lang="ts" setup>
import { NavBar as navBar } from '@/types/base';
import NavBar from '@/components/navBar/index.vue';
import routers from '@/router/routes';
import OutIn from '@/components/out-in.vue';

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
    <div>
        <NavBar :list="list"></NavBar>
        <div class="main-base">
            <router-view v-slot="{ Component }">
                <out-in>
                    <keep-alive>
                        <component :is="Component"/>
                    </keep-alive>
                </out-in>
            </router-view>
        </div>
    </div>
</template>

<style lang="less">
.main-base {
    margin: 0 auto;
    width: 1100px;
}
</style>
