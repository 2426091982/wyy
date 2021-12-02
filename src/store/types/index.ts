import { 
    CacheCommit, 
    CacheState 
} from "./cacheType";
import { 
    UserState, 
    UserCommit 
} from "./userType";

// 添加全局的State
export type State =  {
    user: UserState;
    cache: CacheState;
};

// 添加全局的Commit
export type CommitType = {
    user: UserCommit;
    cache: CacheCommit;
};
