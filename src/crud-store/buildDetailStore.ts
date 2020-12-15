import { ActionTree, MutationTree } from "vuex";
import { Apis } from "./types";
import getErrorText from "./utils/getErrorText";

const OPEN = "OPEN";
const CLOSE = "RESET";
const FETCH_START = "FETCH_START";
const FETCH_SUCCESS = "FETCH_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";

export interface DetailState {
  visible: boolean;
  requestId: number;
  id: null | string | number;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
  inputData: null | any;
  fetchedData: null | any;
}

let lastRequestId = 0;

const generateRequestId = () => ++lastRequestId;

const buildDetailStore = (
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
  const { getOne: getOneApi } = apis;

  const getDefaultState = (): DetailState => ({
    visible: false,
    requestId: 0,
    id: null,
    loading: false,
    error: null,
    success: false,
    inputData: null,
    fetchedData: null,
  });

  const mutations = <MutationTree<DetailState>>{
    [OPEN](state, { id, data }: { id: string | number; data: any }) {
      state.visible = true;
      state.id = id;
      state.inputData = data;
    },
    [CLOSE](state) {
      Object.assign(state, getDefaultState());
    },

    [FETCH_START](state, { requestId }: { requestId: number }) {
      state.requestId = requestId;

      state.loading = true;
      state.error = null;
      state.success = false;
    },
    [FETCH_SUCCESS](
      state,
      { requestId, data }: { requestId: number; data: any }
    ) {
      if (requestId === state.requestId) {
        state.loading = false;
        state.error = null;
        state.success = true;

        state.fetchedData = data;
      }
    },
    [FETCH_FAILURE](
      state,
      { requestId, error }: { requestId: number; error: { message: string } }
    ) {
      if (requestId === state.requestId) {
        state.loading = false;
        state.error = error;
        state.success = false;
      }
    },
  };

  const actions = <ActionTree<DetailState, any>>{
    async open(
      { commit, dispatch },
      { id, data }: { id: string | number; data: any }
    ) {
      commit(OPEN, { id, data });
      dispatch("fetch");
    },

    async close({ commit }) {
      commit(CLOSE);
    },

    async fetch({ state, commit }) {
      const requestId = generateRequestId();
      commit(FETCH_START, { requestId });
      const { id } = state;
      if (!id) return;
      try {
        const fetchedData = await getOneApi(id);
        commit(FETCH_SUCCESS, { requestId, data: fetchedData });
        return fetchedData;
      } catch (error) {
        const message = getErrorText(error);
        commit(FETCH_FAILURE, {
          requestId,
          id,
          error: { message, error },
        });
      }
    },
  };

  return {
    namespaced: true,
    state: () => ({ ...getDefaultState(), ...extraState() }),
    getters: { ...extraGetters },
    mutations: { ...mutations, ...extraMutations },
    actions: { ...actions, ...extraActions },
  };
};

export default buildDetailStore;
