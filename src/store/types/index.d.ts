
import { Store } from 'vuex';

export interface UserData {
    token: string,
    profile: {
        userId: number, // 用户ID
        avatarUrl: string, // 头像地址
        backgroundUrl: string, // 背景图地址
        nickname: string, // 用户名
    },
}
export type UserState = {
    info?: UserData['profile'],
};

export type User = {
    namespaced: true,
    state: UserState,
    mutations: {
        updateUserInfo: (key: UserState, value: UserData['profile']) => void
    },
}

// RootStore
type Options = {
    state: {
        isLlogin: boolean,
        showLoginD: boolean,
    },
    mutations: {
        changeShowLoginD(state: State,  value: boolean): void,
        changeIsLogin(state: State, value: boolean): void,
    },
    modules: {
        user: User,
    },
};

type State = {
    isLlogin: boolean,
    showLoginD: boolean,
    user: UserState,
};

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $store: Store<State>
    }
}

declare module 'vuex' {
    function createStore(options: Options)
        : Store<State>;
}
