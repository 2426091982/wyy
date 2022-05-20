<script lang="ts" setup>
import { 
    reactive, 
    ref, 
    UnwrapRef 
} from "@vue/reactivity";
import { 
    CloseOutlined,
    MobileOutlined,
    LockOutlined 
} from '@ant-design/icons-vue';
import EmailLogin from './emaliLogin.vue';
import { phoneLogin } from "@/api";
import { UserInfo } from "@/store/types/user";
import { checkLogin, noAutoLogin } from "@/utils";

interface FormState {
  phone: string;
  password: string;
}

let emits = defineEmits(['changeIsTwoCodeLogin']);
let isPhoneLogin = ref(true); // 手机登录页
let autoLogin = ref(false); // 自动登录
let formRef = ref();
let loading = ref(false);

const formState: UnwrapRef<FormState> = reactive({
    phone: '',
    password: '',
});
const rules = reactive({
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
});
const onSubmit = async () => {
    let { phone, password, } = await formRef.value.validate() as FormState;
    loading.value = true;
    let { code,  profile, } = await phoneLogin(+phone, password) as UserInfo & { code: number };
    checkLogin(code, profile);
    loading.value = false;
    if (!autoLogin.value) {
        noAutoLogin();
    }
};
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSubmit();
});
// 切换登录模式
const switchLogin = () => isPhoneLogin.value = !isPhoneLogin.value;
</script>

<template>
    <transition name="switch-login-mode" mode="out-in">
        <div v-if="isPhoneLogin">
            <div class="login-modal-header">
                <div class="two-code-login">
                    <img src="/images/to-two-code.png" @click="emits('changeIsTwoCodeLogin')" alt="二维码登录" />
                    <span> 扫码登录更安全 </span>
                </div>
                <div class="close-icon">
                    <close-outlined @click="$store.state.showLoginD = false"/>
                </div>
            </div>
            <div class="login-modal-body">
                <img src="/images/login-bg.png" alt="背景" />
                <a-form
                    ref="formRef"
                    :rules="rules"
                    :model="formState"
                    layout="inline"
                    class="login-form"
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
                        <a-input-password
                            v-model:value="formState.password"
                            class="login-input"
                            placeholder="请输入密码"
                            autocomplete="current-password"
                        >
                            <template #prefix>
                                <lock-outlined style="color: rgba(0, 0, 0, 0.25)" />
                            </template>
                            <template #suffix>
                                <a-button type="link"> 重置密码 </a-button>
                            </template>
                        </a-input-password>
                    </a-form-item>
                    <a-form-item class="margin0 login-checkbox">
                        <a-checkbox v-model:checked="autoLogin">自动登录</a-checkbox>
                    </a-form-item>
                    <a-form-item>
                        <a-button
                            type="primary"
                            shape="round"
                            class="login-input"
                            :loading="loading"
                            @click="onSubmit"
                        >
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>
                <div class="switch-login">
                    <a-button 
                        type="link" 
                        style="color: #333;"
                        @click="isPhoneLogin = !isPhoneLogin"
                    >&nbsp;&nbsp;&nbsp;邮箱登录&nbsp;&gt;</a-button>
                </div>
            </div>
        </div>
        <email-login 
            v-else
            @changeIsTwoCodeLogin="emits('changeIsTwoCodeLogin')" 
            @switchLogin="switchLogin"
        ></email-login>
    </transition>
</template>

<style lang="less">
.two-code-login {
    position: relative;
    height: 70px;
    user-select: none;

    img {
        width: 52px;
        height: 52px;
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
        width: 100%;
        height: 123px;
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
    margin-top: 8px;
}

.switch-login {
    margin: 20px;
    text-align: center;
}
</style>
