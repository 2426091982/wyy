import { Store } from 'vuex';
import {
    User,
    UserState
} from './user';

// RootStore
type Options = {
    state: {
        isLlogin: boolean,
        showLoginD: boolean,
        onLine: boolean,
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
    onLine: boolean,
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
