/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
    getStatus, 
    logout 
} from '@/api';
import { store } from '@/store';
import { JsonData, UserInfo } from '@/store/types/user';
import { message } from "ant-design-vue";
import { InferComment } from './types';
import md5 from "md5";
import { TagsData } from '@/store/types/songSheet';

export const isObject = <T>(value: T) => typeof value === 'object' && value !== null; 

export const isArray = Array.isArray;

export const isUndef = <T>(value: T) => value == undefined;

export const toMD5 = (password: string) => md5(password);

export const stop = (e: Event) => e.stopPropagation();

// 生成时间戳
export const now = () => Date.now();

export const fn = () => null;

export const day = () => new Date().getDate();

export const setItem = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));

export const getItem = <T>(key: string): T => JSON.parse(localStorage.getItem(key) || 'null');

export const clearDefaultEvent = (e: Event) => e.preventDefault();

// 将数据挂载到Vuex
export const mountData = (profile: unknown, tips = '登录成功') => {
    store.commit('user/updateUserInfo', profile); // 存储数据
    store.state.isLogin = true;
    store.state.showLoginD = false;
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
    store.commit('user/updateUserInfo', null); // 卸载数据
    store.state.isLogin = false;
    message.success('退出登录成功');
    await logout();
};

// 退出登录
export const noAutoLogin = () => window.addEventListener('beforeunload', loginOut);

// 检测登录
export const isLogin = () => {
    if (!store.state.isLogin) {
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
 * 格式化播放量
 * @param count 播放量
 * @returns 1000 -> 1万 100000000 -> 1亿
 */
export const parsePlayCount = (count: string) => {
    const len = count.length;
    if (len >= 5 && len < 9) {
        return count.slice(0, -4) + '万';
    } else if (len >= 9) {
        return count.slice(0, -8) + '亿';
    } else {
        return count;
    }
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

/**
 * 处理时间
 * @param time 时间
 * @returns 时:分:秒 / 分:秒
 */
export const handlePlayTime = (time: number) => {
    const hours = Math.floor(time / 60 / 60);
    let minute = Math.floor(time / 60);
    minute = minute >= 60 ? Math.floor(minute / 60) : minute;
    const scound = Math.floor(time - (hours * 60 * 60 + minute * 60));
    return `${
        hours > 9
            ? hours + ':'
            : hours === 0 
                ? ''
                : '0' + hours + ':'
    }${
        minute > 9 
            ? minute
            : '0' + minute
    }:${
        scound > 9
            ? scound
            : '0' + scound
    }`;
};

/**
 * 格式化作家名称：xxx/xxx 
 * @param artists 需要解析的对象
 */
export const parseArtists = (artists: JsonData['song']['artists'] | string) => {
    if (typeof artists === 'string') return artists;
    let names = ``;
    artists.forEach((item) => names += `/${item.name}`);
    return names.slice(1);
};

/**
 * 将子标签分类
 * @param categories 分类标识
 * @param tags 群体标签
 */
export const handleTags = (categories: TagsData['categories'], tags: TagsData['sub']) => {
    const data: TagsData['sub'][]  = [];
    tags.forEach((tag) => {
        const category = tag.category;
        isArray(data[category]) ? data[category].push(tag) : data[category] = [tag];
    });
    return data;
};

/**
 * 节流函数
 * @param fn 回调函数
 * @param wait 等待时长（ms）
 * @param immediately 是否立即执行（默认ture）
 * @returns 代理函数
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const throttle = <T extends Function>(
    fn: T, 
    wait = 200
) => {
    let time: any;
    let reslute :any;
    let prev = 0;
    return (e: any, ...args: any) => {
        if (e && e?.code === 'Space') clearDefaultEvent(e);
        if (now() - prev >= wait) {
            clearTimeout(time);
            reslute = fn.call(this, e, ...args);
            prev = now();
        } else if (!time) {
            time = setTimeout(() => {
                clearTimeout(time);
                reslute = fn.call(this, e, ...args);
            }, wait);
        }
        return reslute;
    };
};
