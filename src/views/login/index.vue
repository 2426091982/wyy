<script lang="ts" setup>
import { 
    MobileOutlined,
    CloseOutlined, 
    LockOutlined 
} from '@ant-design/icons-vue';
import { reactive, ref, UnwrapRef } from '@vue/reactivity';
import { FormProps } from 'ant-design-vue';

const onClose =  () => {
    console.log('关闭登录框');
};

interface FormState {
  phone: string;
  password: string;
}
let autoLogin = ref(false);
const rules ={
    phone: [
        { 
            required: true, 
            message: '手机号不能为空', 
            trigger: ['blur', 'change'], 
        },
        {
            pattern: /^1[0-9]{10}$/,
            message: '手机号格式不正确',
            trigger: 'blur', 
        }
    ],
    password: [
        {
            required: true,
            message: '密码不能为空',
            trigger: ['blur', 'change'],
        }
    ],
};
const formState: UnwrapRef<FormState> = reactive({
    phone: '',
    password: '',
});
const handleFinish: FormProps['onFinish'] = (values) => {
    console.log(values, formState);
};
const handleFinishFailed: FormProps['onFinishFailed'] = (errors) => {
    console.log(errors);
};

let style = reactive({
    top: '100px',
    left: '50%',
});
let startX = 0;
let startY = 0;
let offsetLeft = 0;
let offsetTop = 0;
let minY = 0;
let minX = 0;
let maxY = 0;
let maxX = 0;
let el: HTMLDivElement;
let modal = ref<HTMLDivElement>();
const doc = document.documentElement;
const portability = ['top', 'right', 'bottom', 'left'];
const mouseDown = (e: MouseEvent) => {
    !el ? el = modal.value! : null;
    startX = e.pageX;
    startY = e.pageY;
    offsetLeft = el.offsetLeft;
    offsetTop =  el.offsetTop;
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
</script>

<template>
    <div class="login-modal" ref="modal" :style="style">
        <div 
            v-for="position in portability" 
            :class="`portability-${position} portability`" 
            @mousedown="mouseDown"
            :key="position"
        ></div>
        <div class="login-modal-header">
            <div class="two-code-login">
                <img src="/images/to-two-code.png" alt="二维码登录">
                <span>扫码登录更安全</span>
            </div>
            <div class="close-icon">
                <close-outlined @click="onClose"/>
            </div>
        </div>
        <div class="login-modal-body">
            <img src="/images/login-bg.png" alt="背景">
            <a-form
                class="login-form"
                layout="inline"
                :rules="rules"
                :model="formState"
                @finish="handleFinish"
                @finishFailed="handleFinishFailed"
            >
                <a-form-item class="margin0" name="phone">
                    <a-input 
                        v-model:value="formState.phone" 
                        type="tel" 
                        class="login-input"
                        :maxlength="11" 
                        placeholder="请输入手机号"
                        autocomplete="phone"
                    >
                        <template #prefix>
                            <mobile-outlined style="color: rgba(0, 0, 0, 0.25)" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item class="margin0" name="password">
                    <a-input 
                        v-model:value="formState.password" 
                        type="password" 
                        class="login-input"
                        placeholder="请输入密码"
                        autocomplete="current-password"
                    >
                        <template #prefix>
                            <lock-outlined style="color: rgba(0, 0, 0, 0.25)" />
                        </template>
                        <template #suffix> 
                            <a-button type="link" > 重置密码 </a-button> 
                        </template> 
                    </a-input>
                </a-form-item>
                <a-form-item class="margin0 login-checkbox">
                    <a-checkbox v-model:checked="autoLogin">自动登录</a-checkbox>
                </a-form-item>
                <a-form-item class="margin0" >
                    <a-button
                        type="primary"
                        shape="round"
                        class="login-input"
                        html-type="submit"
                    >
                        登录
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
 
<style lang="less">
.margin0 {
    margin: 0 !important;
}

.login-modal {
    position: fixed;
    width: 350px;
    height: 500px;
    background-color: #fff;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
    transform: translateX(-50%);
    transition: top 0.1s, left 0.1s;
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

.two-code-login {
    user-select: none;

    img {
        cursor: pointer;
    }

    span {
        position: relative;
        left: -5px;
        padding: 2px 10px;
        color: #ffffff;
        font-size: 14px;
        border-radius: 2px;
        background-color: #999999;

        &::before {
            content: "";
            position: absolute;
            top: -2px;
            left: -14px;
            border-bottom: 5px solid #999999;
            border-right: 8px solid #999999;
            border-top: 10px solid transparent;
            border-left: 10px solid transparent;
            transform: rotateZ(20deg);
        }
    }
}

.close-icon {
    position: relative;
    padding: 10px;
    font-size: 20px;
    color: #ccc;
}

.login-modal-body {
    // margin-top: 20px;

    img {
        user-select: none;
    }
}

.login-form {
    justify-content: center;
}

.login-checkbox {
    padding-top: 10px;
    width: 250px;
    height: 40px;
}

.login-input {
    width: 250px;
    height: 35px;
    margin-top: 15px;
}
</style>
