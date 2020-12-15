import { ActionContext, ActionTree, MutationTree } from "vuex";
import { Apis } from "./types";
import getErrorText from "./utils/getErrorText";

const OPEN = "OPEN";
const CLOSE = "CLOSE";
const CREATE_START = "CREATE_START";
const CREATE_SUCCESS = "CREATE_SUCCESS";
const CREATE_FAILURE = "CREATE_FAILURE";

export interface CreateState {
  visible: boolean;
  loading: boolean;
  error: null | { message: string };
  success: boolean;
  submittedData: null | any;
  resultData: null | any;
}

const buildCreateStore = (
  {
    appName,
    apis,
    getEntityId = (item: any) => item.id,
    redirectOnSuccess,
    reloadDashboardOnSuccess,
    showNotificationOnSuccess,
  }: {
    appName: string;
    apis: Apis;
    getEntityId: (item: any) => string | number;
    redirectOnSuccess:
      | null
      | undefined
      | "DASHBOARD"
      | "UPDATE"
      | "DETAIL"
      | ((context: ActionContext<CreateState, any>, data: any) => any);
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
  const { create: createApi } = apis;

  const getDefaultState = (): CreateState => ({
    visible: false,
    loading: false,
    error: null,
    success: false,
    submittedData: null,
    resultData: null,
  });

  const mutations = <MutationTree<CreateState>>{
    [OPEN](state) {
      state.visible = true;
    },
    [CLOSE](state) {
      Object.assign(state, getDefaultState());
    },

    [CREATE_START](state, submittedData: any) {
      state.loading = true;
      state.error = null;
      state.success = false;

      state.submittedData = JSON.parse(JSON.stringify(submittedData));
    },
    [CREATE_SUCCESS](state, data: any) {
      state.loading = false;
      state.error = null;
      state.success = true;

      state.resultData = data;
    },
    [CREATE_FAILURE](state, error: { message: string }) {
      state.loading = false;
      state.error = error;
      state.success = false;
    },
  };

  const actions = <ActionTree<CreateState, any>>{
    open({ commit }) {
      commit(OPEN);
    },

    close({ commit }) {
      commit(CLOSE);
    },

    async create(context, submittedData: any) {
      const { commit, dispatch } = context;
      commit(CREATE_START, submittedData);
      try {
        const resultData = await createApi(submittedData);
        const id = getEntityId(resultData);
        commit(CREATE_SUCCESS, resultData);
        if (showNotificationOnSuccess) {
          dispatch(
            appName + "/Notification/showSuccess",
            "Tạo mới thành công",
            {
              root: true,
            }
          );
        }
        if (reloadDashboardOnSuccess) {
          dispatch(appName + "/Dashboard/updatePage", 1, { root: true });
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

        if (redirectOnSuccess === "UPDATE") {
          dispatch(
            appName + "/UpdatePage/open",
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
        commit(CREATE_FAILURE, { message: getErrorText(error), error });
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

export default buildCreateStore;
