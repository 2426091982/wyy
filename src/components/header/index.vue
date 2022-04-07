<script lang="ts" setup>
import { 
    SwapOutlined,
    RightOutlined,
    LogoutOutlined,
    BellOutlined,
    SettingOutlined,
    CaretDownOutlined,
    UserOutlined 
} from '@ant-design/icons-vue';
import { 
    DyismaData, 
    FollowedsData, 
    FollowsData 
} from '@/store/types/user';
import { 
    getDynamic, 
    getFolloweds, 
    getFollows 
} from '@/api';
import { ref } from '@vue/reactivity';
import { useStore } from '@/store';
import { loginOut } from '@/utils';
import historicalRecords from './historicalRecords.vue';
import Loading from '@/components/loading.vue';
import Seach from '@/components/search/index.vue';

let loading = ref(true);
let showDropdown = ref(false);

const store = useStore();
const user = store.state.user;

// 获取用户动态
const getUserDynamic = async (uid: number) => {
    const {
        events, 
        lasttime, 
        more, 
        size,
    } = await getDynamic(uid) as DyismaData;
    user.dyisma['events'] = events;
    user.dyisma['lasttime'] = lasttime;
    user.dyisma['more'] = more;
    user.dyisma['size'] = size;
};

// 获取用户关注列表
const getUserFollow = async (uid: number) => {
    const {
        follow,
        more,
    } = await getFollows(uid) as FollowsData;
    user.follows['follow'] = follow;
    user.follows['more'] = more;
    user.follows['size'] = follow.length;
};

// 获取用户粉丝列表
const getUserFolloweds = async (uid: number) => {
    const {
        followeds,
        more,
        newCount,
        size,
    } = await getFolloweds(uid) as FollowedsData;
    user.followeds['followeds'] = followeds;
    user.followeds['newCount'] = newCount;
    user.followeds['more'] = more;
    user.followeds['size'] = size;
};

// 发送请求，更新数据
const sends = async () => {
    if(!user.info) return;
    if (!showDropdown.value) return;
    const uid: number = user.info.userId;
    await Promise.all([
        getUserDynamic(uid), 
        getUserFollow(uid), 
        getUserFolloweds(uid)
    ]);
    loading.value = false;
};

</script>

<template>
    <a-layout-header class="header" style="padding: 0">
        <div class="flex-item">
            <div class="logo" @click="$router.push('/')">
                <img src="/images/logo1.png" alt="logo">
                网抑云音乐
            </div>
            <div class="historical">
                <historical-records></historical-records>
            </div>
            <Seach></Seach>
        </div>
        <div class="flex-item">
            <a-space :size="20">
                <a-space v-if="store.state.isLlogin && user.info">
                    <a-dropdown v-model:visible="showDropdown" trigger="click" @visibleChange="sends">
                        <a-space class="base-pointer">
                            <a-avatar>
                                <template #icon>
                                    <img :src="user.info.avatarUrl" alt="">
                                </template>
                            </a-avatar>
                            <span class="login">
                                {{ user.info.nickname }}
                                <caret-down-outlined />
                            </span>
                        </a-space>
                        <template #overlay>
                            <div class="overlay">
                                <Loading :loading="loading" height="64px">
                                    <a-row class="base-text-center">
                                        <a-col :span="8">
                                            <router-link 
                                                :to="{ 
                                                    path: '/dynamic', 
                                                    query: { 
                                                        name: user.info.nickname, 
                                                        id: user.info.userId, 
                                                    },
                                                }"
                                            >
                                                <a-statistic class="base-pointer" title="动态" :value="user.dyisma.size"/>
                                            </router-link>
                                        </a-col>
                                        <a-col :span="8">
                                            <router-link to="/">
                                                <a-statistic class="base-pointer" title="关注" :value="user.follows.size" />
                                            </router-link>
                                        </a-col>
                                        <a-col :span="8">
                                            <router-link to="/">
                                                <a-statistic class="base-pointer" title="粉丝" :value="user.followeds.size" />
                                            </router-link>
                                        </a-col>
                                    </a-row>
                                </Loading>
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
                        <template #icon><user-outlined class="base-pointer" /></template>
                    </a-avatar>
                    <span class="login base-pointer" @click="$store.commit('changeShowLoginD', true)">未登录</span>
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

.login {
    color: #ffffff;
    transition: color 0.2s;
    
    &:hover {
        color: #dddddd;
    }
}
</style>

<style lang="less">
.center {
    text-align: center;
    padding: 30px 50px;
}

/* 下拉框样式 */
.overlay {
    position: relative;
    right: 10%;
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
