import { 
    Store,
    createStore, 
    useStore as baseUseStore
} from 'vuex';
import { State } from './types';
import { InjectionKey } from 'vue';

export const store = createStore({
    state: {
        isLlogin: false,
        showLoginD: false,
    },
    mutations: {
        changeShowLoginD(state, value) {
            state.showLoginD = value;
        },
    },
    modules: {
        list: {
            namespace: true,
            state: { 
                item: '123',
            },
            mutations: {
                changeItem(key, value) {
                    key.item =value;
                },
            },
        },
    },
});

export const key: InjectionKey<Store<State>> = Symbol();
export function useStore () {
    return baseUseStore(key);
}
