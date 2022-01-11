import { Store } from 'vuex';
import { CurrentMusic, CurrentMusicState } from './CurrentMusic';
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
        currentMusic: CurrentMusic
    },
};

type State = {
    isLlogin: boolean,
    showLoginD: boolean,
    onLine: boolean,
    user: UserState,
    currentMusic: CurrentMusicState
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
