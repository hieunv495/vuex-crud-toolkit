import { ActionTree, MutationTree } from "vuex";
import { Apis } from "./types";
import getErrorText from "./utils/getErrorText";

const CLOSE = "CLOSE";
const OPEN = "OPEN";
const REMOVE_START = "REMOVE_START";
const REMOVE_SUCCESS = "REMOVE_SUCCESS";
const REMOVE_FAILURE = "REMOVE_FAILURE";

export interface RemoveState {
  visible: boolean;
  id: null | string | number;
  inputData: null | any;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
}

const buildRemoveStore = (
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
  const { remove: removeApi } = apis;

  const getDefaultState = (): RemoveState => ({
    visible: false,
    id: null,
    inputData: null,
    loading: false,
    error: null,
    success: false,
  });

  const getters = {};

  const mutations = <MutationTree<RemoveState>>{
    [OPEN](state, { id, data }: { id: string | number; data: any }) {
      state.visible = true;
      state.id = id;
      state.inputData = data;
    },
    [CLOSE](state) {
      Object.assign(state, getDefaultState());
    },
    [REMOVE_START](state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    [REMOVE_SUCCESS](state) {
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    [REMOVE_FAILURE](state, error: { message: string }) {
      state.loading = false;
      state.error = error;
      state.success = false;
    },
  };

  const actions = <ActionTree<RemoveState, any>>{
    open({ commit }, { id, data }: { id: string | number; data: any }) {
      commit(OPEN, { id, data });
    },

    close({ commit }) {
      commit(CLOSE);
    },

    async remove({ state, commit, dispatch }) {
      commit(REMOVE_START);
      const { id } = state;
      if (!id) return;
      try {
        await removeApi(id);
        commit(REMOVE_SUCCESS);
        dispatch("close");
        dispatch(appName + "/Dashboard/fetch", null, { root: true });
        dispatch(appName + "/Notification/showSuccess", "Xóa thành công", {
          root: true,
        });
        return { success: true };
      } catch (error) {
        const message = getErrorText(error);
        commit(REMOVE_FAILURE, { message, error });
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

export default buildRemoveStore;
