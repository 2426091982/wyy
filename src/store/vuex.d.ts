import { Store } from 'vuex';
import { 
    State, 
    CommitType 
} from './types';

declare module '@vue/runtime-core' {
    // 注入类型到vue的原型
    interface ComponentCustomProperties {
        $state: Store<State>
    }
}

declare module  'Vuex' {
    // 改写Commit的类型
    interface Commit {
        (type: CommitType[keyof CommitType], payload: unknown): void;
    }
}
