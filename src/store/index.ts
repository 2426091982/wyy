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
import search from './modules/search';
import lyric from './modules/lyric';

export const store = createStore({
    state: {
        isLogin: false,
        showLoginD: false,
        onLine: navigator.onLine,
        audio: null,
    },
    modules: {
        user,
        currentMusic,
        playList,
        songSheet,
        privateContent,
        newSong,
        recommendSongs,
        search,
        lyric,
    },
});

export const key: InjectionKey<Store<State>> = Symbol();
export function useStore () {
    return baseUseStore(key);
}
