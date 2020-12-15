import { ActionTree, MutationTree } from "vuex";
export interface NotificationState {
    success: {
        visible: boolean;
        message: null | string;
    };
    error: {
        visible: boolean;
        message: null | string;
    };
}
declare const _default: {
    namespaced: boolean;
    state: () => NotificationState;
    mutations: MutationTree<NotificationState>;
    actions: ActionTree<NotificationState, any>;
};
export default _default;
