import { ActionTree, MutationTree } from "vuex";
import { Apis } from "./types";
import getErrorText from "./utils/getErrorText";

const CLOSE = "CLOSE";
const OPEN = "OPEN";
const EMPTY_START = "REQUEST_START";
const EMPTY_SUCCESS = "REQUEST_SUCCESS";
const EMPTY_FAILURE = "REQUEST_FAILURE";

export interface TrashEmptyState {
  visible: boolean;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
}

const buildTrashEmptyStore = (
  {
    appName,
    apis,
  }: {
    appName: string;
    apis: Apis;
  },
  {
    state: extraState,
    getters: extraGetters,
    mutations: extraMutations,
    actions: extraActions,
  } = {
    state: () => ({}),
    getters: {},
    mutations: {},
    actions: {},
  }
) => {
  const { trashEmpty: emptyApi } = apis;

  const getDefaultState = (): TrashEmptyState => ({
    visible: false,
    loading: false,
    error: null,
    success: false,
  });

  const getters = {};

  const mutations = <MutationTree<TrashEmptyState>>{
    [OPEN](state) {
      state.visible = true;
    },
    [CLOSE](state) {
      Object.assign(state, getDefaultState());
    },
    [EMPTY_START](state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    [EMPTY_SUCCESS](state) {
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    [EMPTY_FAILURE](state, error: { message: string }) {
      state.loading = false;
      state.error = error;
      state.success = false;
    },
  };

  const actions = <ActionTree<TrashEmptyState, any>>{
    open({ commit }) {
      commit(OPEN);
    },

    close({ commit }) {
      commit(CLOSE);
    },

    async empty({ state, commit, dispatch }) {
      commit(EMPTY_START);
      try {
        await emptyApi();
        commit(EMPTY_SUCCESS);
        dispatch("close");
        dispatch(appName + "/Dashboard/fetch", null, { root: true });
        dispatch(appName + "/Notification/showSuccess", "Dọn dẹp thành công", {
          root: true,
        });
        return { success: true };
      } catch (error) {
        const message = getErrorText(error);
        commit(EMPTY_FAILURE, { message, error });
      }
    },
  };

  return {
    namespaced: true,
    state: () => ({ ...getDefaultState(), ...extraState() }),
    getters: { ...getters, ...extraGetters },
    mutations: { ...mutations, ...extraMutations },
    actions: { ...actions, ...extraActions },
  };
};

export default buildTrashEmptyStore;
