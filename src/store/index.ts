import { 
    Store,
    createStore, 
    useStore as baseUseStore
} from 'vuex';
import { State } from './types';
import { InjectionKey } from 'vue';
import user from './modules/user';
import currentMusic from './modules/currentMusic';
import playList from './modules/playList';
import songSheet from './modules/songSheet';
import privateContent from './modules/privateContent';
import newSong from './modules/newSong';
import recommendSongs from './modules/recommendSongs';

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
        playList,
        songSheet,
        privateContent,
        newSong,
        recommendSongs,
    },
});

export const key: InjectionKey<Store<State>> = Symbol();
export function useStore () {
    return baseUseStore(key);
}
