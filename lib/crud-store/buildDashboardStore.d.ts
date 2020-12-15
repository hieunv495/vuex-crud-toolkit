import { Apis } from "./types";
export interface DashboardState {
    requestId: number;
    loading: boolean;
    error: null | {
        message: string;
    };
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
}
declare const buildDashboardStore: ({ apis, defaultFilter, defaultPage, defaultLimit, }: {
    apis: Apis;
    defaultFilter: any;
    defaultPage: number;
    defaultLimit: number;
}, { state: extraState, mutations: extraMutations, actions: extraActions }?: {
    state: () => {};
    mutations: {};
    actions: {};
}) => {
    namespaced: boolean;
    state: () => {
        requestId: number;
        loading: boolean;
        error: null | {
            message: string;
        };
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
export default buildDashboardStore;
