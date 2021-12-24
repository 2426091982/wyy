<script lang="ts" setup>
import { 
    SwapOutlined,
    RightOutlined,
    LogoutOutlined,
    BellOutlined,
    SettingOutlined,
    SearchOutlined, 
    UserOutlined 
} from '@ant-design/icons-vue';
import { ref } from '@vue/reactivity';
import { useStore } from '@/store';
import { loginOut } from '@/utils';
import historicalRecords from './historicalRecords.vue';


let value = ref('');
let onSearch = () => {
    console.log('搜索');
};
let store = useStore();
let user = store.state.user;

</script>

<template>
    <a-layout-header class="header" style="padding: 0">
        <div class="flex-item">
            <div class="logo">
                <img src="/images/logo1.png" alt="logo">
                网抑云音乐
            </div>
            <div class="historical">
                <historical-records></historical-records>
            </div>
            <div class="search">
                <a-input v-model:vlaue="value" placeholder="大家都在搜索" @keydown.enter="onSearch">
                    <template v-slot:prefix>
                        <search-outlined style="color: #fff" @click="onSearch"/>
                    </template>
                </a-input>
            </div>
        </div>
        <div class="flex-item">
            <a-space :size="20">
                <a-space v-if="user.info">
                    <a-dropdown trigger="click">
                        <a-space>
                            <a-avatar>
                                <template #icon>
                                    <img :src="user.info.avatarUrl" alt="">
                                </template>
                            </a-avatar>
                            <span class="login pointer">
                                {{ user.info.nickname }}
                            </span>
                        </a-space>
                        <template #overlay>
                            <div class="overlay">
                                <a-row class="textCenter">
                                    <a-col :span="8">
                                        <a-statistic class="pointer" title="动态" :value="0"/>
                                    </a-col>
                                    <a-col :span="8">
                                        <a-statistic class="pointer" title="关注" :value="0" />
                                    </a-col>
                                    <a-col :span="8">
                                        <a-statistic class="pointer" title="粉丝" :value="0" />
                                    </a-col>
                                </a-row>
                                <a-menu class="header-menu">
                                    <a-menu-item class="header-menu-item" key="1">
                                        <a-row>
                                            <a-col :span="8">
                                                <user-outlined class="margin-left" />
                                                <span>个人信息</span>
                                            </a-col>
                                            <a-col :span="8" :offset="8" style="text-align: end;">
                                                <right-outlined />
                                            </a-col>
                                        </a-row>
                                    </a-menu-item>
                                    <a-menu-item class="header-menu-item" key="2">
                                        <a-row>
                                            <a-col :span="8">
                                                <swap-outlined class="margin-left"/>
                                                <span>更换绑定手机</span>
                                            </a-col>
                                            <a-col :span="8" :offset="8" style="text-align: end;">
                                                <right-outlined />
                                            </a-col>
                                        </a-row>
                                    </a-menu-item>
                                    <a-menu-item class="header-menu-item" key="3" @click="loginOut">
                                        <logout-outlined class="margin-left" />
                                        <span>退出登录</span>
                                    </a-menu-item>
                                </a-menu>
                            </div>
                        </template>
                    </a-dropdown>
                </a-space>
                <a-space v-else>
                    <a-avatar @click="$store.commit('changeShowLoginD', true)">
                        <template #icon><user-outlined class="pointer" /></template>
                    </a-avatar>
                    <span class="login pointer" @click="$store.commit('changeShowLoginD', true)">未登录</span>
                </a-space>
                <a-badge count="5" dot>
                    <bell-outlined class="header-icon" />
                </a-badge>
                <setting-outlined class="header-icon" />
            </a-space>
        </div>
    </a-layout-header>
</template>

<style lang="less">
.header-icon {
    color: #ffffff;
    font-size: 18px;
    cursor: pointer;
}

.margin-left {
    margin-right: 10px;
}

.header {
    display: flex;
    height: 60px;
    justify-content: space-between;
    background-color: #1890ff;
    
    .flex-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex: 50%;
        color: #ffffff;

        &:last-child {
            padding-right: 100px;
            justify-content: flex-end;
        }
    }
}

.logo {
    width: 200px;
    height: 60px;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 2px;
    text-align: center;
    user-select: none;
    cursor: pointer;
    
    img {
        width: 30px;
        height: 30px;
    }
}

.historical {
    display: flex;
    margin-left: 30px;
    margin-right: 15px;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.search  {
    .ant-input-affix-wrapper {
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 20px;
    }

    .ant-input {
        padding-left: 10px;
        outline: 0;
        border: none;
        background-color: rgba(255, 255, 255, 0);
        caret-color: #ffffff;
        &::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
    }
}

.login {
    color: #ffffff;
    transition: color 0.2s;
    
    &:hover {
        color: #dddddd;
    }
}
</style>

<style lang="less">
/* 下拉框样式 */
.overlay {
    position: relative;
    right: -45%;
    width: 300px;
    padding-top: 10px;
    box-shadow: 0px 0px 10px #999999;
    background-color: #ffffff;
    user-select: none;

    &::before {
        content: '';
        position: absolute;
        top: -4px;
        left: 30%;
        border-top: 10px solid transparent;
        border-left: 10px solid transparent;
        border-right: 10px solid #ffffff;
        border-bottom: 10px solid #ffffff;
        transform: translateX(-40%) rotateZ(230deg);
    }
}
.header-menu {
    margin-top: 10px;
    padding-top: 10px;
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
}

.header-menu-item {
    color: #333 !important;
    background-color: #ffffff !important;
    &:hover {
        background-color: #f0f0f0 !important;
    }
}

</style>
