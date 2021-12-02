import { 
    createStore,
    Store, 
    useStore as baseUseStore 
} from 'vuex';
import { InjectionKey } from 'vue';
import user from './modules/user';
import cache from './modules/cache';
import { State } from './types';

export const store = createStore({
    modules: {
        user,
        cache,
    },
});

// 定义注入的标识
export const key:InjectionKey<Store<State>> = Symbol();

export function useStore() {
    return baseUseStore(key);
}
