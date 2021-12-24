/* eslint-disable @typescript-eslint/no-explicit-any */
export const qs = {
    stringify<T extends object>(query: T) {
        let str = '';
        for (const key in query) {
            str += `${key}=${query[key]}&`;
        }
        return str.slice(0, -1);
    },
    parse(str: string) {
        const obj: {[key: string]: string} = {};
        str.replace(/([0-9a-zA-Z]+)=([0-9a-zA-Z]+)/g, (_, key:string, value: string) => obj[key] = value);
        return obj;
    },
};

const objToFormData = <T extends {[key: string]: any}>(obj: T) => {
    const formData = new FormData;
    for (const key in obj) formData.append(key, obj[key]);
    return formData;
};

const ask = (url: string, query: object) => {
    return `${ url }${ url.includes('?') ? '&' : '?' }${ qs.stringify(query) }&time=${now()}`;
};

// 生成时间戳
const now = () => Date.now();

class Request {
    public baseUrl: string;
    public config: RequestInit;
    constructor() {
        const headers = new Headers;
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        this.baseUrl = 'http://localhost:5000';
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
        return new Promise((resolve, reject) => {
            fetch(url, {
                ...this.config,
                method,
                body: body,
            }).then((response) => {
                const res = response.json().then(this.responseInterceptor);
                resolve(res);
            }).catch(reject);
        });
    }

    get(path: string, query?: object) {
        let url = `${this.baseUrl}${path}`;
        query ? url = ask(url, query) : url = `${url}?time=${now()}`;
        
        return this.send(url, 'get');
    }

    post(path: string, body: object) {
        const url = `${this.baseUrl}${path}`;
        return this.send(url, 'post', objToFormData(body));
    }

    responseInterceptor(response: any) {
        switch (response.code) {
        case 200:
            return response.data ?? response;
        default :
            return response;
        }
    }
}

export default new Request;
