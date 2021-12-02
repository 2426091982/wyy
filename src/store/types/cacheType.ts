import { Mutation } from "Vuex";

export interface CacheState {
    cache: string;
}

export type CacheCommit = 'cache/getCache';

export type CacheMutation = {
    [key in CacheCommit]: Mutation<CacheState>;
}
