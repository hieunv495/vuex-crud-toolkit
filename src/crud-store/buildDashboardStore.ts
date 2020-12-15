import { ActionTree, MutationTree } from "vuex";
import { Apis } from "./types";
import getErrorText from "./utils/getErrorText";

const RESET = "RESET";
const UPDATE_TRASH_MODE = "SET_TRASH_MODE";
const UPDATE_FILTER = "UPDATE_FILTER";
const UPDATE_PAGE = "UPDATE_PAGE";
const UPDATE_LIMIT = "UPDATE_LIMIT";
const FETCH_START = "FETCH_START";
const FETCH_SUCCESS = "FETCH_SUCCESS";
const FETCH_FAILURE = "FETCH_FAILURE";

export interface DashboardState {
  requestId: number;
  loading: boolean;
  error: null | { message: string };
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

let lastRequestId = 0;

const generateRequestId = () => ++lastRequestId;

const buildDashboardStore = (
  {
    apis,
    defaultFilter,
    defaultPage,
    defaultLimit,
  }: {
    apis: Apis;
    defaultFilter: any;
    defaultPage: number;
    defaultLimit: number;
  },
  { state: extraState, mutations: extraMutations, actions: extraActions } = {
    state: () => ({}),
    mutations: {},
    actions: {},
  }
) => {
  const { getList, trashGetList, count, trashCount } = apis;

  const getDefaultState = (): DashboardState => ({
    requestId: 0,
    loading: false,
    error: null,
    success: false,
    items: [],
    limit: defaultLimit,
    page: defaultPage,
    total: 0,
    filter: defaultFilter,
    trashMode: false,
    status: {
      normalTotal: 0,
      trashTotal: 0,
    },
  });

  const mutations = <MutationTree<DashboardState>>{
    [RESET](state) {
      Object.assign(state, getDefaultState());
    },
    [UPDATE_TRASH_MODE](state, mode: boolean) {
      if (mode !== state.trashMode) {
        state.filter = defaultFilter;
        state.page = defaultPage;
      }
      state.trashMode = mode;
    },

    [UPDATE_FILTER](state, filter: any) {
      state.filter = filter;
      state.page = defaultPage;
    },

    [UPDATE_PAGE](state, page: number) {
      state.page = page;
    },

    [UPDATE_LIMIT](state, limit: number) {
      state.limit = limit;
      state.page = defaultPage;
    },

    [FETCH_START](state, { requestId }: { requestId: number }) {
      state.requestId = requestId;
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    [FETCH_SUCCESS](
      state,
      {
        requestId,
        items,
        total,
        status,
      }: {
        requestId: number;
        items: any[];
        total: number;
        status: {
          normalTotal: number;
          trashTotal: number;
        };
      }
    ) {
      if (requestId === state.requestId) {
        state.loading = false;
        state.error = null;
        state.success = true;

        state.items = items;
        state.total = total;
        state.status = status;
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

  const actions = <ActionTree<DashboardState, any>>{
    updateTrashMode({ commit, dispatch }, mode: boolean) {
      commit(UPDATE_TRASH_MODE, mode);
      dispatch("fetch");
    },

    updateFilter({ commit, dispatch }, filter: any) {
      commit(UPDATE_FILTER, filter);
      dispatch("fetch");
    },
    updatePage({ commit, dispatch }, page: number) {
      commit(UPDATE_PAGE, page);
      dispatch("fetch");
    },
    updateLimit({ commit, dispatch }, limit: number) {
      commit(UPDATE_LIMIT, limit);
      dispatch("fetch");
    },

    async fetch({ commit, state }) {
      const trashMode = state.trashMode;

      const getItemsApi = trashMode ? trashGetList : getList;
      const countApi = trashMode ? trashCount : count;

      const { filter, limit, page } = state;

      const requestId = generateRequestId();

      commit(FETCH_START, { requestId, page });
      try {
        const getItemsPromise = getItemsApi({
          ...filter,
          limit,
          offset: (page - 1) * limit,
        });
        const getTotalPromise = countApi({
          ...filter,
          limit,
          offset: (page - 1) * limit,
        });

        const getNormalTotalPromise = count();
        const getTrashTotalPromise = trashCount();

        const [items, total, normalTotal, trashTotal] = await Promise.all([
          getItemsPromise,
          getTotalPromise,
          getNormalTotalPromise,
          getTrashTotalPromise,
        ]);

        commit(FETCH_SUCCESS, {
          requestId,
          items,
          total,
          status: { normalTotal, trashTotal },
        });
      } catch (e) {
        console.log(e);
        const errorMessage = getErrorText(e);
        commit(FETCH_FAILURE, { requestId, error: errorMessage });
      }
    },
  };

  return {
    namespaced: true,
    state: () => ({ ...getDefaultState(), ...extraState() }),
    mutations: { ...mutations, ...extraMutations },
    actions: { ...actions, ...extraActions },
  };
};

export default buildDashboardStore;
