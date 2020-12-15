import { Apis } from "./types";
declare const buildCRUDStore: ({ appName, apis, getEntityId, dashboardConfig, createConfig, updateConfig, }: {
    appName: string;
    apis: Apis;
    getEntityId: any;
    dashboardConfig: any;
    createConfig: any;
    updateConfig: any;
}, { state: extraState, getters: extraGetters, mutations: extraMutations, actions: extraActions, }?: {
    state: () => {};
    getters: {};
    mutations: {};
    actions: {};
}) => {
    namespaced: boolean;
    state: () => {};
    getters: {};
    mutations: {};
    actions: {
        init({ commit, dispatch }: any): void;
    };
    modules: {
        Notification: {
            namespaced: boolean;
            state: () => import("./notificationStore").NotificationState;
            mutations: import("vuex").MutationTree<import("./notificationStore").NotificationState>;
            actions: import("vuex").ActionTree<import("./notificationStore").NotificationState, any>;
        };
        Dashboard: {
            namespaced: boolean;
            state: () => {
                requestId: number;
                loading: boolean;
                error: {
                    message: string;
                } | null;
                success: boolean;
                items: any[];
                limit: number;
                page: number;
                total: number;
                filter: any;
                trashMode: boolean;
                status: {
                    normalTotal: number;
                    trashTotal: number;
                };
            };
            mutations: {};
            actions: {};
        };
        DetailPage: {
            namespaced: boolean;
            state: () => {
                visible: boolean;
                requestId: number;
                id: string | number | null;
                loading: boolean;
                error: {
                    message: string;
                } | null;
                success: boolean;
                inputData: any;
                fetchedData: any;
            };
            getters: {};
            mutations: {};
            actions: {};
        };
        CreatePage: {
            namespaced: boolean;
            state: () => {
                visible: boolean;
                loading: boolean;
                error: {
                    message: string;
                } | null;
                success: boolean;
                submittedData: any;
                resultData: any;
            };
            getters: {};
            mutations: {};
            actions: {};
        };
        UpdatePage: {
            namespaced: boolean;
            state: () => {
                visible: boolean;
                id: string | number | null;
                inputData: any;
                fetchLoading: boolean;
                fetchError: {
                    message: string;
                } | null;
                fetchSuccess: boolean;
                fetchedData: any;
                updateLoading: boolean;
                updateError: {
                    message: string;
                } | null;
                updateSuccess: boolean;
                submittedData: any;
                resultData: any;
            };
            getters: {};
            mutations: {};
            actions: {};
        };
        ConfirmRemove: {
            namespaced: boolean;
            state: () => {
                visible: boolean;
                id: string | number | null;
                inputData: any;
                loading: boolean;
                error: {
                    message: string;
                } | null;
                success: boolean;
            };
            getters: {};
            mutations: {};
            actions: {};
        };
        ConfirmRestore: {
            namespaced: boolean;
            state: () => {
                visible: boolean;
                id: string | number | null;
                inputData: any;
                loading: boolean;
                error: {
                    message: string;
                } | null;
                success: boolean;
            };
            getters: {};
            mutations: {};
            actions: {};
        };
        ConfirmPurge: {
            namespaced: boolean;
            state: () => {
                visible: boolean;
                id: string | number | null;
                inputData: any;
                loading: boolean;
                error: {
                    message: string;
                } | null;
                success: boolean;
            };
            getters: {};
            mutations: {};
            actions: {};
        };
        ConfirmTrashEmpty: {
            namespaced: boolean;
            state: () => {
                visible: boolean;
                loading: boolean;
                error: {
                    message: string;
                } | null;
                success: boolean;
            };
            getters: {};
            mutations: {};
            actions: {};
        };
    };
};
export default buildCRUDStore;
