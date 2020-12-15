import { ActionContext } from "vuex";
import { Apis } from "./types";
export interface UpdateState {
    visible: boolean;
    id: null | string | number;
    inputData: null | any;
    fetchLoading: boolean;
    fetchError: null | {
        message: string;
    };
    fetchSuccess: boolean;
    fetchedData: null | any;
    updateLoading: boolean;
    updateError: null | {
        message: string;
    };
    updateSuccess: boolean;
    submittedData: null | any;
    resultData: null | any;
}
declare const buildUpdateStore: ({ appName, apis, redirectOnSuccess, reloadDashboardOnSuccess, showNotificationOnSuccess, }: {
    appName: string;
    apis: Apis;
    redirectOnSuccess: "DETAIL" | "DASHBOARD" | ((context: ActionContext<UpdateState, any>, data: any) => any) | null;
    reloadDashboardOnSuccess: boolean;
    showNotificationOnSuccess: boolean;
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
        fetchLoading: boolean;
        fetchError: null | {
            message: string;
        };
        fetchSuccess: boolean;
        fetchedData: null | any;
        updateLoading: boolean;
        updateError: null | {
            message: string;
        };
        updateSuccess: boolean;
        submittedData: null | any;
        resultData: null | any;
    };
    getters: {};
    mutations: {};
    actions: {};
};
export default buildUpdateStore;
