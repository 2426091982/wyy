import { Mutation } from 'vuex';

export interface UserState {
    userName: string,
    token: string,
}

export type UserCommit = 'user/setToken' | 'user/getToken'; 

export type Mutations = {
    [key in UserCommit]: Mutation<UserState>;
};
