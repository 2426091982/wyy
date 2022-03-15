<script lang='ts' setup>
import { NavBar } from "@/types/base";
import { PropType } from "@vue/runtime-core";

defineProps({
    list: Array as PropType<NavBar>,
});

</script>

<template>
    <div class="nav-bar">
        <div v-for="item in list" class="nav-bar-item" :key="item.path">
            <div>
                <router-link class="anv-bar-text" :to="item.path"> {{ item.name }} </router-link>
            </div>
        </div>
    </div>
</template>

<style lang='less'>
.nav-bar {
    display: flex;
    width: 100%;
    height: 50px;
    gap: 25px;
    align-items: center;
    min-width: 760px;
}

.anv-bar-text {
    color: #333333;
    padding: 8px 5px;
}

.anv-bar-text.router-link-exact-active {
    position: relative;
    font-size: 18px;
    font-weight: 700;
    color: #1890ff;
}

.anv-bar-text.router-link-exact-active::after {
    content: '';
    position: absolute;
    left: 10%;
    bottom: 0px;
    width: 80%;
    height: 3px;
    background-color: #1890ff;
}
</style>
