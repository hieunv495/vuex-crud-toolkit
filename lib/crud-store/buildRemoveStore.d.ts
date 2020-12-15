import { Apis } from "./types";
export interface RemoveState {
    visible: boolean;
    id: null | string | number;
    inputData: null | any;
    loading: boolean;
    error: null | {
        message: string;
    };
    success: boolean;
}
declare const buildRemoveStore: ({ appName, apis, }: {
    appName: string;
    apis: Apis;
}, { state: extraState, getters: extraGetters, mutations: extraMutations, actions: extraActions, }?: {
    state: () => {};
    getters: {};
    mutations: {};
    actions: {};
}) => {
    namespaced: boolean;
    state: () => {
        visible: boolean;
        id: null | string | number;
        inputData: null | any;
        loading: boolean;
        error: null | {
            message: string;
        };
        success: boolean;
    };
    getters: {};
    mutations: {};
    actions: {};
};
export default buildRemoveStore;
