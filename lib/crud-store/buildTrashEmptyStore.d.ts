import { Apis } from "./types";
export interface TrashEmptyState {
    visible: boolean;
    loading: boolean;
    error: null | {
        message: string;
    };
    success: boolean;
}
declare const buildTrashEmptyStore: ({ appName, apis, }: {
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
export default buildTrashEmptyStore;
