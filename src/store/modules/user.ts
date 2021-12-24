import { User } from '../types';

const user: User = {
    namespaced: true,
    state: { },
    mutations: {
        updateUserInfo(state, value) {
            state.info = value;
        },
    },
};

export default user;
