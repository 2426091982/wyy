/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from '@/store';
import { now } from '@/utils';
import { message } from 'ant-design-vue';

const objToFormData = <T extends {[key: string]: any}>(obj: T) => {
    const formData = new FormData;
    for (const key in obj) formData.append(key, obj[key]);
    return formData;
};

const ask = (url: string, query: object) => {
    return `${ url }${ 
        url.includes('?') ? '&' : '?' 
    }${ qs.stringify(query) }`;
};

export const qs = {
    stringify<T extends object>(query: T) {
        let str = '';
        for (const key in query) {
            if (query[key] === undefined) break;
            str += `${key}=${query[key]}&`;
        }
        return str.slice(0, -1);
    },
    parse(str: string) {
        const obj: {[key: string]: string} = {};
        const reg = /([0-9a-zA-Z]+)=([0-9a-zA-Z]+)/g;
        str.replace(reg, (_, key:string, value: string) => obj[key] = value);
        return obj;
    },
};

class Request {
    public baseUrl: string;
    public config: RequestInit;
    public abortController?: AbortController; 
    constructor() {
        const headers = new Headers;
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        this.baseUrl = 'https://wyy-app.vercel.app';
        this.config = {
            credentials: 'include',
            mode: 'cors',
            cache: 'no-cache',
            headers,
        };
    }

    send(
        url: string, 
        method: string, 
        body: FormData | null = null
    ) {
        if (!this.requestInterceptor()) return Promise.resolve({}); // 请求前的拦截
        let timer: NodeJS.Timeout;
        return new Promise((resolve, reject) => {
            // 请求中止控制器
            this.abortController = new AbortController();
            fetch(url, {
                ...this.config,
                method,
                body: body,
                signal: this.abortController.signal,
            }).then((response) => {
                clearTimeout(timer);
                const res = response.json().then(this.responseInterceptor);
                resolve(res);
            }).catch(() => console.log('请求超时'));
            timer = setTimeout(() => {
                clearTimeout(timer);
                this.abort();
            }, 20000);
        });
    }

    get<T>(path: string, query?: object, time = false): Promise<T> {
        let url = `${this.baseUrl}${path}`;
        time && query ? query['time'] = now() : null;
        url = query ? `${ask(url, query)}` : url;
        return this.send(url, 'get') as unknown as Promise<T>;
    }

    post(path: string, body: any, time = false) {
        const url = `${this.baseUrl}${path}`;
        time ? body.time = now() : null;
        return this.send(url, 'post', objToFormData(body));
    }

    abort() { // 中止请求
        this.abortController?.abort();
        message.warn('请求超时，请稍后再试');
    }

    responseInterceptor(response: any) {
        if ('subed' in response) {
            response.data.subed = response.subed;
        }
        
        switch (response.code) {
        case 200:
            return response.data ?? response;
        default :
            return response;
        }
    }

    requestInterceptor() {
        if (!store.state.onLine) {
            message.error('当前网络不可用！');
            return false;
        }
        return true;
    }
}

export default new Request;