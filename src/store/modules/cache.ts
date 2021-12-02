import { GetterTree, Module, Store } from "Vuex";
import { CacheMutation, CacheState } from "../types/cacheType";

// state
const state: CacheState = {
    cache: 'cache',
};

// getters
const getters: GetterTree<CacheState, any> = {
    getState(state, getter) {
        console.log(state, getter);
    },
};

// mutations
const mutations: CacheMutation = {
    getCache(state, payload) {
        state.cache = payload;
    },
};

const cache/* : Module<CacheState, Store<CacheState>> */ = {
    namespaced: true,
    state,
    getters,
    mutations,
};

export default cache;
