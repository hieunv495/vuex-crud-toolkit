import { Apis } from "./types";
export interface DetailState {
    visible: boolean;
    requestId: number;
    id: null | string | number;
    loading: boolean;
    error: null | {
        message: string;
    };
    success: boolean;
    inputData: null | any;
    fetchedData: null | any;
}
declare const buildDetailStore: ({ appName, apis, }: {
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
        requestId: number;
        id: null | string | number;
        loading: boolean;
        error: null | {
            message: string;
        };
        success: boolean;
        inputData: null | any;
        fetchedData: null | any;
    };
    getters: {};
    mutations: {};
    actions: {};
};
export default buildDetailStore;
