import { Mutations } from "./types/userType";

const mutations: Mutations = {
    setToken(state, options) {
        state.userName = options;
    },
};

export default mutations;
