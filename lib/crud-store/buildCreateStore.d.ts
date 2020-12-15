import { ActionContext } from "vuex";
import { Apis } from "./types";
export interface CreateState {
    visible: boolean;
    loading: boolean;
    error: null | {
        message: string;
    };
    success: boolean;
    submittedData: null | any;
    resultData: null | any;
}
declare const buildCreateStore: ({ appName, apis, getEntityId, redirectOnSuccess, reloadDashboardOnSuccess, showNotificationOnSuccess, }: {
    appName: string;
    apis: Apis;
    getEntityId: (item: any) => string | number;
    redirectOnSuccess: "DASHBOARD" | "UPDATE" | "DETAIL" | ((context: ActionContext<CreateState, any>, data: any) => any) | null | undefined;
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
        loading: boolean;
        error: null | {
            message: string;
        };
        success: boolean;
        submittedData: null | any;
        resultData: null | any;
    };
    getters: {};
    mutations: {};
    actions: {};
};
export default buildCreateStore;
