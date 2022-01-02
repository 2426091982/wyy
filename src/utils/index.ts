/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
    getStatus, 
    logout 
} from '@/api';
import { store } from '@/store';
import { UserInfo } from '@/store/types/user';
import { message } from "ant-design-vue";
import { InferComment } from './types';

import md5 from "md5";

export const isObject = <T>(value: T) => typeof value === 'object' && value !== null; 

export const isArray = Array.isArray;

export const toMD5 = (password: string) => md5(password);

// 将数据挂载到Vuex
export const mountData = (profile: unknown, tips = '登录成功') => {
    store.commit('user/updateUserInfo', profile); // 存储数据
    store.commit('changeIsLogin', true);
    store.commit('changeShowLoginD', false);
    message.success(tips);
};

// 请求登录以及存储数据
export const checkLogin = <T>(code: number, profile: T) => {
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

// 通过本地cookie，获取登录状态
type StatusData = { data: UserInfo };
export const getLoginStatus = async () => {
    const {
        data: { // 从data中再次解构
            profile,
        },
    } = await getStatus() as StatusData;
    // if (profile == null) return;
    return deconstruction(
        [
            'avatarUrl',
            'backgroundUrl',
            'nickname',
            'userId'
        ],
        profile
    );
};

// 退出登录
export const loginOut = async () => {
    await logout();
    store.commit('user/updateUserInfo', null); // 卸载数据
    store.commit('changeIsLogin', false);
    message.success('退出登录成功');
};

// 退出登录
export const noAutoLogin = () => window.addEventListener('beforeunload', loginOut);

// 检测登录
export const isLogin = () => {
    if (!store.state.isLlogin) {
        message.error('请登录后，再进行操作~');
        return false;
    }
    return true;
};

// 解构对应的字段
export const deconstruction = <T>(chars: (InferComment<T>)[], data: T) => {
    if (!isObject(data)) return data;
    let newData: any;
    if (isArray(data)) {
        newData = [];
        data.forEach((value, k) => {
            newData[k] = {};
            for (let i = 0; i < chars.length; i++) {
                const key = chars[i];
                newData[k][key] =  value[key];
            }
        });
    } else {
        newData = {};
        for(let i = 0; i < chars.length; i++) {
            const key = chars[i];
            newData[key] = data[key];
        }
    }
    return newData as T;
};

/**
 * 解析时间
 * @param time 时间
 * @param second 是否显示秒钟
 * @returns xxxx年xx月xx日 时:分(:秒)
 */
export const parseDate = (time: number, second = false) => {
    const date = new Date(time);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const add0 = (val: number) => val < 10 ? '0' + val : val; 
    return `${
        date.getFullYear()
    }年${
        add0(month)
    }月${
        add0(day)
    }日 ${
        add0(hours)
    }:${
        add0(minutes)
    }${
        second ? ':' + add0(seconds) : ''
    }`;
};
