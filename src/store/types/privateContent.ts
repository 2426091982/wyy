type state = PrivateContent['state'];

export interface PrivateContent {
    namespaced: true;
    state: {
        list: PrivateContentData[];
    };
    mutations: {
        push: (state: state, value: PrivateContentData[]) => void;
    };
}

export interface PrivateContentData {
    copywriter: string; // 文案
    id: number;
    name: string;
    picUrl: string; // 背景图
    sPicUrl: string;
    type: number; // 资源类型
    url: string;
}

