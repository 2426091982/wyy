import { 
    GetterTree, 
    Module, 
    Store 
} from 'vuex';
import { 
    UserState,
    Mutations 
} from '../types/userType';

// state
const state: UserState = {
    userName: '',
    token: '',
};

// getters
const getters: GetterTree<UserState, any> = {
    getToken(state, getters) {
        console.log(state, getters);
        return {
            aaa: 666,
        };
    },
};

// mutations
const mutations: Mutations = {
    setToken(state, options) {
        console.log(options);
        state.token = options;
    },
    getToken(state, options) {
        console.log(state, options, "getToken");
    },
};

// userModule
const user/* : Module<UserState, Store<UserState>> */ = {
    namespaced: true,
    state,
    getters,
    mutations,
};

export default user;
