import { ActionTree, MutationTree } from "vuex";
import { Apis } from "./types";
import getErrorText from "./utils/getErrorText";

const CLOSE = "CLOSE";
const OPEN = "OPEN";
const PURGE_START = "PURGE_START";
const PURGE_SUCCESS = "PURGE_SUCCESS";
const PURGE_FAILURE = "PURGE_FAILURE";

export interface PurgeState {
  visible: boolean;
  id: null | string | number;
  inputData: null | any;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
}

const buildPurgeStore = (
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
  const { trashPurge: purgeApi } = apis;

  const getDefaultState = (): PurgeState => ({
    visible: false,
    id: null,
    inputData: null,
    loading: false,
    error: null,
    success: false,
  });

  const getters = {};

  const mutations = <MutationTree<PurgeState>>{
    [OPEN](state, { id, data }: { id: string | number; data: any }) {
      state.visible = true;
      state.id = id;
      state.inputData = data;
    },
    [CLOSE](state) {
      Object.assign(state, getDefaultState());
    },
    [PURGE_START](state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    [PURGE_SUCCESS](state) {
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    [PURGE_FAILURE](state, error: { message: string }) {
      state.loading = false;
      state.error = error;
      state.success = false;
    },
  };

  const actions = <ActionTree<PurgeState, any>>{
    open({ commit }, { id, data }: { id: string | number; data: any }) {
      commit(OPEN, { id, data });
    },

    close({ commit }) {
      commit(CLOSE);
    },

    async purge({ state, commit, dispatch }) {
      commit(PURGE_START);
      const { id } = state;
      if (!id) return;
      try {
        await purgeApi(id);
        commit(PURGE_SUCCESS);
        dispatch("close");
        dispatch(appName + "/Dashboard/fetch", null, { root: true });
        dispatch(appName + "/Notification/showSuccess", "Dọn dẹp thành công", {
          root: true,
        });
        return { success: true };
      } catch (error) {
        const message = getErrorText(error);
        commit(PURGE_FAILURE, { message, error });
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

export default buildPurgeStore;
