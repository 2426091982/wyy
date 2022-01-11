import { 
    Store,
    createStore, 
    useStore as baseUseStore
} from 'vuex';
import { State } from './types';
import { InjectionKey } from 'vue';
import user from './modules/user';
import currentMusic from './modules/currentMusic';

export const store = createStore({
    state: {
        isLlogin: false,
        showLoginD: false,
        onLine: navigator.onLine,
    },
    mutations: {
        changeIsLogin(state, value) {
            state.isLlogin = value;
        },
        changeShowLoginD(state, value) {
            state.showLoginD = value;
        },
    },
    modules: {
        user,
        currentMusic,
    },
});

export const key: InjectionKey<Store<State>> = Symbol();
export function useStore () {
    return baseUseStore(key);
}
