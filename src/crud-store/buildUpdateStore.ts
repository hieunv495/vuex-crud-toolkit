import { ActionTree, MutationTree, ActionContext } from "vuex";
import { Apis } from "./types";
import getErrorText from "./utils/getErrorText";

const OPEN = "OPEN";
const CLOSE = "CLOSE";
const FETCH_START = "FETCH_START";
const FETCH_SUCCESS = "FETCH_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";
const UPDATE_START = "UPDATE_START";
const UPDATE_SUCCESS = "UPDATE_SUCCESS";
const UPDATE_FAILURE = "UPDATE_FAILURE";

export interface UpdateState {
  visible: boolean;

  id: null | string | number;
  inputData: null | any;

  fetchLoading: boolean;
  fetchError: null | { message: string };
  fetchSuccess: boolean;
  fetchedData: null | any;

  updateLoading: boolean;
  updateError: null | { message: string };
  updateSuccess: boolean;
  submittedData: null | any;
  resultData: null | any;
}

const buildUpdateStore = (
  {
    appName,
    apis,
    redirectOnSuccess,
    reloadDashboardOnSuccess,
    showNotificationOnSuccess,
  }: {
    appName: string;
    apis: Apis;
    redirectOnSuccess:
      | null
      | "DETAIL"
      | "DASHBOARD"
      | ((context: ActionContext<UpdateState, any>, data: any) => any);
    reloadDashboardOnSuccess: boolean;
    showNotificationOnSuccess: boolean;
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
  const { getOne: getOneApi, update: updateApi } = apis;

  const getDefaultState = (): UpdateState => ({
    visible: false,

    id: null,
    inputData: null,

    fetchLoading: false,
    fetchError: null,
    fetchSuccess: false,
    fetchedData: null,

    updateLoading: false,
    updateError: null,
    updateSuccess: false,
    submittedData: null,
    resultData: null,
  });

  const mutations = <MutationTree<UpdateState>>{
    [OPEN](state, { id, data }: { id: string | number; data: any }) {
      state.visible = true;
      state.id = id;
      state.inputData = JSON.parse(JSON.stringify(data));
    },

    [CLOSE](state) {
      Object.assign(state, getDefaultState());
    },

    [FETCH_START](state) {
      state.fetchLoading = true;
      state.fetchError = null;
      state.fetchSuccess = false;
    },
    [FETCH_SUCCESS](state, fetchedData) {
      state.fetchLoading = false;
      state.fetchError = null;
      state.fetchSuccess = true;

      state.fetchedData = fetchedData;
    },
    [FETCH_FAILURE](state, error) {
      state.fetchLoading = false;
      state.fetchError = error;
      state.fetchSuccess = false;
    },

    [UPDATE_START](state, submittedData) {
      state.updateLoading = true;
      state.updateError = null;
      state.updateSuccess = false;

      state.submittedData = JSON.parse(JSON.stringify(submittedData));
    },
    [UPDATE_SUCCESS](state, resultData) {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = true;

      state.resultData = resultData;
    },
    [UPDATE_FAILURE](state, error: { message: string }) {
      state.updateLoading = false;
      state.updateError = error;
      state.updateSuccess = false;
    },
  };

  const actions = <ActionTree<UpdateState, any>>{
    open(
      { commit, dispatch },
      { id, data }: { id: string | number; data: any }
    ) {
      commit(OPEN, { id, data });
      dispatch("fetch");
    },

    close({ commit }) {
      commit(CLOSE);
    },

    async fetch({ state, commit }) {
      const { id } = state;
      if (!id) return;
      commit(FETCH_START);

      try {
        const resultData = await getOneApi(id);
        commit(FETCH_SUCCESS, resultData);
        return resultData;
      } catch (error) {
        commit(FETCH_FAILURE, { message: getErrorText(error), error });
      }
    },

    async update(context, submittedData) {
      const { state, commit, dispatch } = context;
      const { id } = state;
      if (!id) return;
      commit(UPDATE_START, submittedData);
      try {
        const resultData = await updateApi(id, submittedData);
        commit(UPDATE_SUCCESS, resultData);

        if (showNotificationOnSuccess) {
          dispatch(
            appName + "/Notification/showSuccess",
            "Cập nhật thành công",
            {
              root: true,
            }
          );
        }
        if (reloadDashboardOnSuccess) {
          dispatch(appName + "/Dashboard/fetch", null, { root: true });
        }
        if (redirectOnSuccess === "DASHBOARD") {
          dispatch("close");
        }
        if (redirectOnSuccess === "DETAIL") {
          dispatch(
            appName + "/DetailPage/open",
            { id, data: resultData },
            { root: true }
          );
          dispatch("close");
        }

        if (typeof redirectOnSuccess === "function") {
          redirectOnSuccess(context, resultData);
        }

        return resultData;
      } catch (error) {
        commit(UPDATE_FAILURE, { message: getErrorText(error), error });
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

export default buildUpdateStore;
