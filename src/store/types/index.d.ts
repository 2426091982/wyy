
import { Store } from 'vuex';


export type List = {
    item: string,
};

// RootStore
type Options = {
    state: {
        isLlogin: boolean,
        showLoginD: boolean,
    },
    mutations: {
        changeShowLoginD(state: State,  value: boolean): void,
    },
    modules: {
        list: {
            namespace: true,
            state: List,
            mutations: {
                changeItem: (key: List, value: string) => void
            },
        },
    },
};

type State = {
    isLlogin: boolean,
    showLoginD: boolean,
    list: List,
};

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $store: Store<State>
    }
}

declare module 'vuex' {
    function createStore(options: Options)
        : () => void;
}
