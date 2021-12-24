import md5 from "md5";
import { store } from '@/store';
import { message } from "ant-design-vue";
import { UserData } from '@/store/types';
import { getStatus, logout } from '@/api';

export const toMD5 = (password: string) => md5(password);

// 将数据挂载到Vuex
export const mountData = (profile: unknown, tips = '登录成功') => {
    store.commit('user/updateUserInfo', profile); // 存储数据
    store.commit('changeIsLogin', true);
    store.commit('changeShowLoginD', false);
    message.success(tips);
};

// 请求登录以及存储数据
export const checkLogin = <T>( code: number, profile: T) => {
    switch (code) {
    case 200: 
        mountData(profile);
        break;
    case 501: 
        message.error('账号不存在');
        break;
    case 502: // 账号或密码错误
        message.error('账号或密码错误');
        break;
    default:
        message.error('登录失败请稍后再试~');
    }
};

type StatusData = { data: UserData };
// 通过本地cookie，获取登录状态
export const getLoginStatus = async () => {
    const { 
        data: { // 从data中再次解构
            profile, 
        },
    } = await getStatus() as StatusData;
    return profile;
};

export const loginOut = async () => {
    await logout();
    store.commit('user/updateUserInfo', null); // 卸载数据
    store.commit('changeIsLogin', false);
    message.success('退出登录成功');
};

export const noAutoLogin = () => window.addEventListener('beforeunload', loginOut);
