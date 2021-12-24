<script lang="ts" setup>
import { checkPhoneExistence, getCaptcha, registerPhone, verifyCaptcha } from '@/api';
import {
    CloseOutlined,
    MobileOutlined,
    LockOutlined,
    KeyOutlined
} from '@ant-design/icons-vue';
import { 
    reactive, 
    ref, 
    UnwrapRef 
} from "@vue/reactivity";
import { message } from 'ant-design-vue';


interface FormState {
  phone: string;
  password: string;
  code: string;
}
type CaptchaData = { exist: 1 | -1, hasPassword: boolean };
type response = { code: number };

let count = ref(60);
let disabled = ref(false);
let autoLogin  = ref(false);
let formRef = ref();

const emits = defineEmits(['switchRegister']);
const formState: UnwrapRef<FormState> = reactive({
    phone: '',
    password: '',
    code: '',
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
            message: '手机号码由11位数字组成',
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
    code: [
        {
            required: true,
            message: '验证码不能为空',
            trigger: ['blur', 'change'],
        }
    ],
});
const getCode = async () => {
    formRef.value.validate(['phone'])
        .then(async () => {
            disabled.value = true;
            let timer = setInterval(() => {
                if (count.value !== 0) {
                    return count.value--;
                }
                count.value = 60;
                disabled.value = false;
                clearInterval(timer);
            }, 1000);
            const { code, } = await getCaptcha(formState.phone) as response;
            if (code === 400) {
                message.error('每个手机号一天只能获取5次验证码！');
                return;
            }
        })
        .catch(() => null);
};
const onSubmit = async () => {
    const { code, phone, password, } = formState;
    const { exist, hasPassword, } = await checkPhoneExistence(phone) as CaptchaData;
    if(exist === 1 && hasPassword) {
        message.error('该手机号已经注册过了');
        return;
    }
    const { code: status, } = await verifyCaptcha(phone,code) as response ;
    if (status !== 200) {
        message.error('手机号或验证码输入错误！');
        return;
    }
    const data = await registerPhone(phone, password, code);
    // 
};
</script>

<template>
    <div>
        <div class="login-modal-header">
            <div class="phone-register" @click="emits('switchRegister')">
                <span> &lt;&nbsp;返回登录 </span>
            </div>
            <div class="close-icon">
                <close-outlined @click="$store.commit('changeShowLoginD', false)"/>
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
                    </a-input-password>
                </a-form-item>
                <a-form-item class="margin0" name="code">
                    <a-input 
                        v-model:value="formState.code"
                        placeholder="请输入验证码"
                        class="login-input-code"
                        type="code" 
                        :maxlength="4"
                    >
                        <template #prefix>
                            <key-outlined style="color: rgba(0, 0, 0, 0.25)" />
                        </template>
                    </a-input>
                    <a-button 
                        type="dashed" 
                        class="wdith102"
                        :disabled="disabled" 
                        @click="getCode" 
                    >
                        {{ !disabled ? `获取验证码` : `${count}s重新获取`}}
                    </a-button>
                </a-form-item>
                <a-form-item class="margin0 login-checkbox">
                    <a-checkbox v-model:checked="autoLogin"> 自动登录 </a-checkbox>
                </a-form-item>
                <a-form-item>
                    <a-button
                        type="primary"
                        shape="round"
                        class="login-input"
                        @click="onSubmit"
                    >
                        注册
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<style lang="less">
.wdith102 {
    width: 102px;
}

.phone-register {
    position: relative;
    padding: 10px;
    cursor: pointer;
    color: #333;
    transition: color 0.8s;

    &:hover {
        color: #40a9ff;
    }
}

.login-input-code {
    margin-top: 8px;
    width: 150px;
}
</style>
