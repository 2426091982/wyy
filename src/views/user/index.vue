<script lang="ts" setup>
import { reactive, ref } from '@vue/reactivity';
import PhoneLogin from './phoneLogin.vue';
import TwoCodeLogin from './twoCodeLogin.vue';
// import { onBeforeUnmount, onMounted } from '@vue/runtime-core';
// import { useStore } from '@/store';
import OutIn from '@/components/out-in.vue';

// const store = useStore();
let isTwoCodeLogin = reactive({
    state: true,
});
let style = reactive({
    top: '200px',
    left: '50%',
});
let minY = 0;
let minX = 0;
let maxY = 0;
let maxX = 0;
let startX = 0;
let startY = 0;
let offsetLeft = 0;
let offsetTop = 0;
let el: HTMLDivElement;
let modal = ref<HTMLDivElement>();
const doc = document.documentElement;
const portability = ['top', 'right', 'bottom', 'left'];
const mouseDown = (e: MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    !el ? el = modal.value! : null;
    startX = e.pageX;
    startY = e.pageY;
    offsetLeft = el.offsetLeft;
    offsetTop = el.offsetTop;
    // 获取边界
    minY = 0;
    maxY = doc.clientHeight - el.clientHeight;
    minX = el.clientWidth / 2;
    maxX = doc.clientWidth - el.clientWidth / 2;
    doc.addEventListener('mousemove', mouseMove);
    doc.addEventListener('mouseup', mouseUp);
};
const mouseMove = (e: MouseEvent) => {
    let currentX = offsetLeft + -(startX - e.pageX);
    let currentY = offsetTop + -(startY - e.pageY);
    // 边界判断
    currentX = currentX >=  maxX ? maxX : currentX <= minX ? minX : currentX;
    currentY = currentY >= maxY ? maxY : currentY <= minY ? minY : currentY;
    style.top = `${ currentY }px`;
    style.left = `${ currentX }px`;
};
const mouseUp = () => {
    doc.removeEventListener('mousemove', mouseMove);
    doc.removeEventListener('mouseup', mouseUp);
};
const changeIsTwoCodeLogin = () => isTwoCodeLogin.state = !isTwoCodeLogin.state;

// const close = (e: KeyboardEvent) => {
//     if (e.code !== 'Escape') return;
//     store.commit('changeShowLoginD', false);
// };

// onMounted(() => {
//     window.addEventListener('keydown', close);
// });

// onBeforeUnmount(() => {
//     window.removeEventListener('keydown', close);
// });
</script>

<template>
    <transition name="modal">
        <div 
            v-if="$store.state.showLoginD" 
            ref="modal" 
            :style="style"
            class="login-modal"
        >
            <div 
                v-for="position in portability" 
                :class="`portability-${position} portability`" 
                @mousedown="mouseDown"
                :key="position"
            ></div>
            <out-in>
                <keep-alive>
                    <component 
                        :is="isTwoCodeLogin.state ? TwoCodeLogin : PhoneLogin"
                        :isTwoCodeLogin="isTwoCodeLogin" 
                        @changeIsTwoCodeLogin="changeIsTwoCodeLogin"
                    ></component>
                </keep-alive>
            </out-in>
        </div>
    </transition>
</template>
 
<style lang="less">
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: translate(-50%, -50px) !important;
    transform-origin: top right;
}

.modal-enter-active,
.modal-leave-active {
    transition: transform 0.5s, opacity 0.4s;
}

.margin0 {
    margin: 0 !important;
}

.login-modal {
    position: fixed;
    width: 350px;
    height: 500px;
    background-color: #fff;
    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.3);
    transform: translateX(-50%);
    overflow: hidden;
    user-select: none;
}

.portability {
    position: absolute;
    cursor: move;
}

.portability-top, 
.portability-bottom {
    width: 100%;
    height: 20px;
}


.portability-left ,
.portability-right {
    width: 20px;
    height: 100%;
}

.portability-top {
    top: 0;
}

.portability-bottom {
    bottom: 0;    
}

.portability-left {
    left: 0;    
}

.portability-right {
    right: 0;    
}

.login-modal-header {
    display: flex;
    height: 70px;
    justify-content: space-between;
}

.switch-login-mode {
    margin-top: 50px;
    cursor: pointer;
}
</style>
