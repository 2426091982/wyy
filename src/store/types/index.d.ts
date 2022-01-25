import { Store } from 'vuex';
import { CurrentMusic, CurrentMusicState } from './CurrentMusic';
import { CurrentPlayList, CurrentPlayListState } from './CurrentPlayList';
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
        currentPlayList: CurrentPlayList
    },
};

type State = {
    isLlogin: boolean,
    showLoginD: boolean,
    onLine: boolean,
    user: UserState,
    currentMusic: CurrentMusicState
    currentPlayList: CurrentPlayListState
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
