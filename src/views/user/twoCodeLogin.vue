<script lang="ts" setup>
import {
    CloseOutlined
} from '@ant-design/icons-vue';
import { onBeforeUnmount, onMounted, ref } from '@vue/runtime-core';
import { 
    getTwoCodeKey,
    createTwoCodeKey,
    checkTwoCodeEffective
} from '@/api';
import { getLoginStatus, mountData, noAutoLogin } from '@/utils';

type TwoCodeKey =  { unikey: string };
type TwoCodeUrl =  { qrimg: string };
type TwoCodeState = { code: number, cookie: string };

let { isTwoCodeLogin, } = defineProps({
    isTwoCodeLogin: {
        type: Object,
        required: true,
    },
});
let emits = defineEmits(['changeIsTwoCodeLogin']);
let key = ref('');
let base64 = ref('');
let reGet = ref(false);
let wait = ref(false);
let enter = ref(false); 
let timer = setInterval(async () => {
    if (!isTwoCodeLogin.state || reGet.value) return; // 如果不在扫码的页面则不发送检测请求
    let { code, } = await checkTwoCodeEffective(key.value) as TwoCodeState;
    switch (code) {
    case 800: // 二维码过期
        reGet.value = true;
        break;
    case 802: // 等待扫码
        wait.value = true;
        break;
    case 803: // 扫码成功，存储cookies
        mountData(await getLoginStatus());
        noAutoLogin();
        clearInterval(timer);
        break;
    }
}, 1000);

const getTwoCode = async () => {
    reGet.value ? reGet.value = false : null;
    let data = await getTwoCodeKey() as TwoCodeKey;
    key.value = data.unikey;
    let { qrimg, } = await createTwoCodeKey(key.value) as TwoCodeUrl;
    base64.value = qrimg;
};

onMounted(() => {
    // 鼠标进入过度动画，默认加载时加载一次
    setTimeout(() => enter.value = true, 200);
    getTwoCode();
});

onBeforeUnmount(() => {
    clearInterval(timer);
});
</script>

<template>
    <div>
        <div class="login-modal-header">
            <div class="two-code-login"></div>
            <div class="close-icon">
                <close-outlined @click="$store.commit('changeShowLoginD', false)"/>
            </div>
        </div>
        <div class="login-modal-body base-text-center">
            <h2>扫码登录</h2>
            <div 
                :class="`two-code-body ${enter ? 'two-code-body-hover' : ''}`" 
                @mouseenter="enter = true" 
                @mouseleave="enter = false"
            >
                <div class="phone-guide">
                    <img src="/images/two-code-login.png" width="auto" alt="手机扫码指引">
                </div>
                <div class="two-code">
                    <img :src="base64" style="background-color: #ccc" alt="二维码">
                    <div v-if="reGet || wait" class="two-code-mask ">
                        <template v-if="reGet">
                            <span>二维码已失效</span>
                            <a-button 
                                type="primary" 
                                shape="round" 
                                size="small"
                                @click="getTwoCode"
                            >
                                重新获取
                            </a-button>
                        </template>
                        <template v-else>
                            <span> 等待授权登录 </span>
                        </template>
                    </div>
                    <p class="tips-text"> 
                        使用 <span class="link">网抑云音乐APP</span> 扫码登录
                    </p>
                </div>
            </div>
        </div>
        <div
            class="switch-login-mode base-text-center" 
            @click="emits('changeIsTwoCodeLogin')"
        > 
            <span> 选择其它登录模式&nbsp;&gt; </span> 
        </div>
    </div>
</template>

<style lang="less">
.two-code-body {
    height: 250px;
}

.two-code-body-hover {
    .phone-guide {
        opacity: 1;
        transform: translate(0px, -50%);
    }

    .two-code {
        top: 20px;
        width: 150px;
        height: 150px;
        text-align: center;
        transform: translateX(80px);
    }

    .tips-text {
        width: 140px;
        margin: 0 auto;
    }
}

.two-code {
    position: relative;
    margin: 0 auto;
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
    transform-origin: bottom right;
    transition-property: width, height, transform, top;
    transition-duration: 0.5s;
    
    img {
        width: 100%;
        height: 100%;
    }
}

.two-code-mask {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.8);
    gap: 10px;
}

.link {
    cursor: pointer;
    color: #1890ff;
}

.phone-guide { /* 手机扫码指引 */
    position: absolute;
    top: 50%;
    left: 10px;
    opacity: 0;
    transform: translate(100px, -50%);
    transition: opacity 0.5s, transform 0.5s;
    img {
        width: 100%;
        height: 100%;
    }
}
</style>
