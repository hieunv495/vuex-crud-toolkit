import buildDashboardStore from "./buildDashboardStore";
import buildUpdateStore from "./buildUpdateStore";
import buildCreateStore from "./buildCreateStore";
import buildDetailStore from "./buildDetailStore";
import buildRemoveStore from "./buildRemoveStore";
import buildRestoreStore from "./buildRestoreStore";
import buildPurgeStore from "./buildPurgeStore";
import buildTrashEmptyStore from "./buildTrashEmptyStore";

import notificationStore from "./notificationStore";
import { Apis } from "./types";

const buildCRUDStore = (
  {
    appName,
    apis,
    getEntityId = (item: any) => item.id,
    dashboardConfig,
    createConfig,
    updateConfig,
  }: {
    appName: string;
    apis: Apis;
    getEntityId: any;
    dashboardConfig: any;
    createConfig: any;
    updateConfig: any;
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
  const { defaultFilter, defaultPage, defaultLimit } = dashboardConfig;

  const state = () => ({});

  const mutations = {};

  const actions = {
    init({ commit, dispatch }: any) {
      dispatch("Dashboard/fetch");
    },
  };

  const dashboardStore = buildDashboardStore({
    apis,
    defaultFilter,
    defaultPage,
    defaultLimit,
  });
  const detailStore = buildDetailStore({
    appName,
    apis,
  });

  const createStore = buildCreateStore({
    appName,
    apis,
    getEntityId,
    ...createConfig,
  });

  const updateStore = buildUpdateStore({
    appName,
    apis,
    ...updateConfig,
  });

  const removeStore = buildRemoveStore({
    appName,
    apis,
  });

  const restoreStore = buildRestoreStore({
    appName,
    apis,
  });

  const purgeStore = buildPurgeStore({
    appName,
    apis,
  });

  const trashEmptyStore = buildTrashEmptyStore({
    appName,
    apis,
  });

  return {
    namespaced: true,
    state: () => ({ ...state(), ...extraState() }),
    getters: { ...extraGetters },
    mutations: { ...mutations, ...extraMutations },
    actions: { ...actions, ...extraActions },
    modules: {
      Notification: notificationStore,
      Dashboard: dashboardStore,
      DetailPage: detailStore,
      CreatePage: createStore,
      UpdatePage: updateStore,
      ConfirmRemove: removeStore,
      ConfirmRestore: restoreStore,
      ConfirmPurge: purgeStore,
      ConfirmTrashEmpty: trashEmptyStore,
    },
  };
};

export default buildCRUDStore;
