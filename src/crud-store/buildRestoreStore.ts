import { ActionTree, Mutation, MutationTree } from "vuex";
import { Apis } from "./types";
import getErrorText from "./utils/getErrorText";

const CLOSE = "CLOSE";
const OPEN = "OPEN";
const RESTORE_START = "RESTORE_START";
const RESTORE_SUCCESS = "RESTORE_SUCCESS";
const RESTORE_FAILURE = "RESTORE_FAILURE";

export interface RestoreState {
  visible: boolean;
  id: null | string | number;
  inputData: null | any;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
}

const buildRestoreStore = (
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
  const { trashRestore: restoreApi } = apis;

  const getDefaultState = (): RestoreState => ({
    visible: false,
    id: null,
    inputData: null,
    loading: false,
    error: null,
    success: false,
  });

  const getters = {};

  const mutations = <MutationTree<RestoreState>>{
    [OPEN](state, { id, data }: { id: string | number; data: any }) {
      state.visible = true;
      state.id = id;
      state.inputData = data;
    },
    [CLOSE](state) {
      Object.assign(state, getDefaultState());
    },
    [RESTORE_START](state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    [RESTORE_SUCCESS](state) {
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    [RESTORE_FAILURE](state, error: { message: string }) {
      state.loading = false;
      state.error = error;
      state.success = false;
    },
  };

  const actions = <ActionTree<RestoreState, any>>{
    open({ commit }, { id, data }: { id: string | number; data: any }) {
      commit(OPEN, { id, data });
    },

    close({ commit }) {
      commit(CLOSE);
    },

    async restore({ state, commit, dispatch }) {
      commit(RESTORE_START);
      const { id } = state;
      if (!id) return;
      try {
        await restoreApi(id);
        commit(RESTORE_SUCCESS);
        dispatch("close");
        dispatch(appName + "/Dashboard/fetch", null, { root: true });
        dispatch(
          appName + "/Notification/showSuccess",
          "Khôi phục thành công",
          {
            root: true,
          }
        );
        return { success: true };
      } catch (error) {
        const message = getErrorText(error);
        commit(RESTORE_FAILURE, { message, error });
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

export default buildRestoreStore;
