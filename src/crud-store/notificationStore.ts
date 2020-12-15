import { ActionTree, MutationTree } from "vuex";

const SHOW_SUCCESS = "SHOW_SUCCESS";
const HIDE_SUCCESS = "HIDE_SUCCESS";

const SHOW_ERROR = "SHOW_ERROR";
const HIDE_ERROR = "HIDE_ERROR";

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

const state = (): NotificationState => ({
  success: {
    visible: false,
    message: null,
  },
  error: {
    visible: false,
    message: null,
  },
});

const mutations = <MutationTree<NotificationState>>{
  [SHOW_SUCCESS](state, message: string) {
    state.success.visible = true;
    state.success.message = message;
  },

  [HIDE_SUCCESS](state) {
    state.success.visible = false;
  },

  [SHOW_ERROR](state, message: string) {
    state.error.visible = true;
    state.error.message = message;
  },

  [HIDE_ERROR](state) {
    state.error.visible = false;
  },
};

const actions = <ActionTree<NotificationState, any>>{
  showSuccess({ commit }, message: string) {
    commit(SHOW_SUCCESS, message);
  },
  hideSuccess({ commit }) {
    commit(HIDE_SUCCESS);
  },

  showError({ commit }, message: string) {
    commit(SHOW_ERROR, message);
  },
  hideError({ commit }) {
    commit(HIDE_ERROR);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
