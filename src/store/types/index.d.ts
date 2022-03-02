import { Store } from 'vuex';
import { CurrentMusic, CurrentMusicState } from './currentMusic';
import { PlayList, PlayListState } from './playList';
import { NewSong } from './newSong';
import { PrivateContent } from './privateContent';
import { RecommendSongs } from './recommendSongs';
import { RecommendSongSheet } from './recommendSongSheet';
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
        user: User;
        currentMusic: CurrentMusic;
        playList: PlayList;
        recommendSongSheet: RecommendSongSheet;
        privateContent: PrivateContent;
        newSong: NewSong;
        recommendSongs: RecommendSongs;
    },
};

type State = {
    isLlogin: boolean;
    showLoginD: boolean;
    onLine: boolean;
    user: UserState;
    currentMusic: CurrentMusicState;
    playList: PlayListState;
    recommendSongSheet: RecommendSongSheet['state'];
    privateContent: PrivateContent['state'];
    newSong: NewSong['state'];
    recommendSongs: RecommendSongs['state'];
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
