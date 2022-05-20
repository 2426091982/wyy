<script lang="ts" setup>
import { 
    RightOutlined,
    LeftOutlined 
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { reactive } from '@vue/runtime-core';

const router = useRouter();
let clear = false;
const goStack: string[] = []; // 前进栈
const backStack: string[] = []; // 后退栈
const arrow = reactive({
    isCannotLeft: true, // 默认置灰按钮
    isCannotRight: true,
});

/**
 * 点击前进按钮或者后退
 * 如果为前进则会将goStack的第一项弹出栈
 *  并且放到backStack栈的最前面一项
 *  之后跳转路由
 * 如果为后退将backStack的第一项弹出栈
 *  并且放到goStack栈的第一项
 * 之后跳转路由，但是如果backStack为最后一项，
 *  那么将会清空goStack栈,因为已经重新进入了
 *  新的路径需要收集路径，并且将旧的路径释放掉
 * @param isGo 是否为前进
 */
const goAndBack = (isGo: boolean) => {
    if (isGo) {
        if (!arrow.isCannotRight) { // 前进
            let path = goStack.shift()!;
            backStack.unshift(path);
            router.push(path);
            if (clear) clear = false;
        }
    } else if (!arrow.isCannotLeft) { // 后退
        goStack.unshift(backStack.shift()!);
        let path = backStack[0];
        router.push(path);
        if (backStack.length === 1) clear = true;
    }
};

/**
 * 每次路由跳转的时候会将mate.flag=true的存储到brackRouters中
 * 当backStack.legnth等于0或者1并且是当前路由路径时则会置灰后退按钮
 * goStack[0]等于当前路由路径则会置灰前进按钮
 */
router.beforeEach((to) => {
    if (to.meta.flag && to.path !== backStack[0]) {
        if (clear) { // 
            goStack.splice(0, goStack.length);
            clear = false;
        }
        backStack.unshift(to.path);
    }
    const len = backStack.length;
    if (len <= 1) { // 后退
        if (!len || backStack[len -1] === to.path) {
            arrow.isCannotLeft = true;
        }
    } else {
        arrow.isCannotLeft = false;
    }
    if (to.path !== goStack[0] && goStack[0]) { // 前进
        arrow.isCannotRight = false;
    } else {
        arrow.isCannotRight = true;
    }
});
</script>

<template>
    <div 
        :class="`arrow-round ${arrow.isCannotLeft ? 'invalid-array': ''}`" 
        @click="goAndBack(false)"
    >
        <left-outlined />
    </div>
    <div 
        :class="`arrow-round  ${arrow.isCannotRight ? 'invalid-array': ''}`" 
        @click="goAndBack(true)" 
    >
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

.invalid-array {
    opacity: 0.5;
}
</style>
