import { PrivateContent } from "../types/privateContent";

const privateContent: PrivateContent = {
    namespaced: true,
    state: {
        list: [],
    },
    mutations: {
        push(state, value) {
            state.list.push(...value);
        },
    },
};

export default privateContent;
