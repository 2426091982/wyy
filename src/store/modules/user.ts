import { User } from '../types/user';

const user: User = {
    namespaced: true,
    state: {
        info: {},
        dyisma: {},
        follows: {},
        followeds: {},
    },
    mutations: {
        updateUserInfo(state, value) {
            state.info = value;
        },
        updateUserEvents(state, value) {
            state.dyisma = value;
        },
    },
};

export default user;
