import { Store } from 'vuex';
import { CurrentMusic, CurrentMusicState } from './currentMusic';
import { PlayList, PlayListState } from './playList';
import { NewSong } from './newSong';
import { PrivateContent } from './privateContent';
import { RecommendSongs } from './recommendSongs';
import { SongSheet } from './songSheet';
import {
    User,
    UserState
} from './user';
import { Search } from './search';
import { Lyric } from './lyric';

// RootStore
type Options = {
    state: {
        isLogin: boolean,
        showLoginD: boolean,
        onLine: boolean,
        audio: HTMLAudioElement | null,
    },
    modules: {
        user: User;
        currentMusic: CurrentMusic;
        playList: PlayList;
        songSheet: SongSheet;
        privateContent: PrivateContent;
        newSong: NewSong;
        recommendSongs: RecommendSongs;
        search: Search;
        lyric: Lyric;
    },
};

type State = {
    // isLogin: boolean;
    // showLoginD: boolean;
    // onLine: boolean;
    user: UserState;
    currentMusic: CurrentMusicState;
    playList: PlayListState;
    songSheet: SongSheet['state'];
    privateContent: PrivateContent['state'];
    newSong: NewSong['state'];
    recommendSongs: RecommendSongs['state'];
    search: Search['state'];
    lyric: Lyric['state'];
} & Options['state'];

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $store: Store<State>
    }
}

declare module 'vuex' {
    function createStore(options: Options)
        : Store<State>;
}
