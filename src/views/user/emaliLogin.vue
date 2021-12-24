<script lang="ts" setup>
import {
    CloseOutlined,
    MailOutlined,
    LockOutlined
} from '@ant-design/icons-vue';
import { reactive, ref, UnwrapRef } from '@vue/reactivity';
import { emailLogin } from '@/api';
import { UserData } from '@/store/types';
import { checkLogin, noAutoLogin } from '@/utils';

interface FormState {
  email: string;
  password: string;
}

let emits = defineEmits(['reset', 'changeIsTwoCodeLogin', 'switchLogin']);
let autoLogin = ref(false);
let formRef = ref();
let loading = ref(false);

const formState: UnwrapRef<FormState> = reactive({
    email: '',
    password: '',
});
const rules = reactive({
    email: [
        { 
            required: true, 
            message: '邮箱不能为空', 
            trigger: ['blur', 'change'], 
        },
        {
            pattern: /^(([0-9A-Za-z]+?)(\.|-)?([0-9A-Za-z]+?)){0,}@163\.com$/,
            message: '邮箱格式不正确',
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
    let { email, password, } = await formRef.value.validate() as FormState;
    loading.value = true;
    let { code, profile, } = await emailLogin(email, password) as UserData & { code: number };
    checkLogin(code, profile);
    loading.value = false;
    if (!autoLogin.value) {
        noAutoLogin();
    }
};
</script>

<template>
    <div>
        <div class="login-modal-header">
            <div class="two-code-login">
                <img src="/images/to-two-code.png" @click="emits('changeIsTwoCodeLogin')" alt="二维码登录" />
                <span> 扫码登录更安全 </span>
            </div>
            <div class="close-icon">
                <close-outlined @click="$store.commit('changeShowLoginD', false)"/>
            </div>
        </div>
        <div class="login-modal-body">
            <img src="/images/email.png" alt="背景" />
            <a-form
                ref="formRef"
                :rules="rules"
                :model="formState"
                layout="inline"
                class="login-form"
            >
                <a-form-item class="margin0" name="email">
                    <a-input
                        v-model:value="formState.email"
                        type="tel"
                        class="login-input"
                        placeholder="请输入邮箱号"
                        autocomplete="email"
                    >
                        <template #prefix>
                            <mail-outlined style="color: rgba(0, 0, 0, 0.25)" />
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
                            <a-button type="link"> 忘记密码? </a-button>
                        </template>
                    </a-input-password>
                </a-form-item>
                <a-form-item class="margin0 login-checkbox">
                    <a-checkbox v-model:checked="autoLogin"> 自动登录 </a-checkbox>
                </a-form-item>
                <a-form-item class="margin0">
                    <a-button
                        type="primary"
                        shape="round"
                        class="login-input"
                        @click="onSubmit"
                    >
                        登录
                    </a-button>
                </a-form-item>
            </a-form>
            <div class="switch-login">
                <a-button type="link" @click="emits('switchLogin')" style="color: #333;">
                    返回其他登录&nbsp;&gt;
                </a-button>
            </div>
        </div>
    </div>
</template>

<style lang="less">
/* 邮箱登录样式 */
.back-other {
    position: relative;
    padding: 10px;
    cursor: pointer;
}
</style>
